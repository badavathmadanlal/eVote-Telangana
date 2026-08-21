import assistantRepository from '../repositories/assistant.repository.js';

class AssistantService {
  async processChat(message) {
    // 1. Search knowledge base (FAQs & Announcements from DB)
    const kbResult = await assistantRepository.searchKnowledgeBase(message);
    if (kbResult) {
      return {
        reply: `I found relevant information in our ${kbResult.source}.`,
        details: kbResult.data,
        source: kbResult.source,
      };
    }

    // 2. Intent detection & predefined guidance
    const intent = assistantRepository.detectIntent(message);
    const guidance = assistantRepository.getPredefinedGuidance(intent);

    return {
      reply: guidance,
      intentDetected: intent !== 'Default' ? intent : null,
      source: 'Knowledge Base',
    };
  }

  // Pluggable provider abstraction (future use)
  async processWithProvider(message, provider = 'internal') {
    switch (provider) {
      case 'openai':
        throw new Error('OpenAI provider not integrated');
      case 'gemini':
        throw new Error('Gemini provider not integrated');
      default:
        return this.processChat(message);
    }
  }
}

export default new AssistantService();
