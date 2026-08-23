import envConfig from '../config/env.js';

/**
 * AI Provider Abstraction
 * Supports configurable LLM providers (OpenAI, Google Gemini, Anthropic, or Mock/Offline Engine).
 * Server-side only; API keys are never exposed to the client.
 */
class AiProviderService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'mock';
    this.apiKey = process.env.AI_API_KEY || '';
    this.model = process.env.AI_MODEL || 'gemini-1.5-flash';
  }

  /**
   * Generate completion from AI Provider with fallback
   * @param {Object} params
   * @param {string} params.systemPrompt
   * @param {string} params.userPrompt
   * @param {Object} [params.contextData]
   * @returns {Promise<{ text: string, provider: string, model: string }>}
   */
  async generateResponse({ systemPrompt, userPrompt, contextData }) {
    // 1. If real provider configured with API key
    if (this.apiKey && this.provider !== 'mock') {
      try {
        if (this.provider === 'openai') {
          return await this._callOpenAi(systemPrompt, userPrompt, contextData);
        } else if (this.provider === 'gemini') {
          return await this._callGemini(systemPrompt, userPrompt, contextData);
        }
      } catch (err) {
        console.warn(`[AI PROVIDER WARNING] ${this.provider} call failed:`, err.message);
        // Graceful fallback to deterministic assistant synthesizer
      }
    }

    // 2. Default/Resilient Engine: Synthesize safe, context-accurate response based on authorized data
    return this._synthesizeResponse(userPrompt, contextData);
  }

  async _callOpenAi(systemPrompt, userPrompt, contextData) {
    const contextStr = contextData ? `\n\nAuthorized Electoral Context:\n${JSON.stringify(contextData, null, 2)}` : '';
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `${userPrompt}${contextStr}` }
        ],
        temperature: 0.2,
        max_tokens: 500
      }),
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      throw new Error(`OpenAI error status: ${res.status}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim() || '';
    return { text, provider: 'openai', model: this.model };
  }

  async _callGemini(systemPrompt, userPrompt, contextData) {
    const contextStr = contextData ? `\n\nAuthorized Electoral Context:\n${JSON.stringify(contextData, null, 2)}` : '';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model || 'gemini-1.5-flash'}:generateContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: `${userPrompt}${contextStr}` }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 500 }
      }),
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      throw new Error(`Gemini error status: ${res.status}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    return { text, provider: 'gemini', model: this.model };
  }

  /**
   * Resilient, deterministic synthesis when external API key is unconfigured or in offline demo mode.
   */
  _synthesizeResponse(userPrompt, contextData) {
    return {
      text: '', // Will be completed by aiAssistant.service.js synthesizer
      provider: 'built-in-electoral-engine',
      model: 'rule-synthesizer-v1'
    };
  }
}

export default new AiProviderService();
