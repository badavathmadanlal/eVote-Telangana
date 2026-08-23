import { RAG_KNOWLEDGE_DOCUMENTS } from '../constants/ragKnowledgeBase.js';

class RagKnowledgeService {
  constructor() {
    this.documents = RAG_KNOWLEDGE_DOCUMENTS;
  }

  /**
   * Search knowledge base with State & Constituency isolation
   * @param {string} query - User query
   * @param {Object} options
   * @param {string} [options.state='ALL'] - Citizen registered state
   * @param {string} [options.constituency='ALL'] - Citizen registered constituency
   * @param {number} [options.limit=3] - Maximum results
   * @returns {Object} { matchFound: boolean, topDocument: Object|null, results: Array<Object>, score: number }
   */
  retrieveKnowledge(query, { state = 'ALL', constituency = 'ALL', limit = 3 } = {}) {
    if (!query || typeof query !== 'string' || !query.trim()) {
      return { matchFound: false, topDocument: null, results: [], score: 0 };
    }

    const cleanQuery = query.trim().toLowerCase();
    const queryTokens = this._tokenize(cleanQuery);

    if (queryTokens.length === 0) {
      return { matchFound: false, topDocument: null, results: [], score: 0 };
    }

    // 1. Filter documents by State Isolation
    // Only 'ALL' or matching citizen state allowed. Strict isolation.
    const normalizedState = (state || 'ALL').trim().toLowerCase();
    const stateFilteredDocs = this.documents.filter(doc => {
      const docState = (doc.state || 'ALL').trim().toLowerCase();
      if (docState === 'all') return true;
      return docState === normalizedState;
    });

    // 2. Score candidate documents
    const scoredDocs = stateFilteredDocs.map(doc => {
      const score = this._computeRelevanceScore(cleanQuery, queryTokens, doc, normalizedState);
      return { doc, score };
    });

    // Sort descending by score
    scoredDocs.sort((a, b) => b.score - a.score);

    const topMatch = scoredDocs[0];
    const CONFIDENCE_THRESHOLD = 0.35;

    if (!topMatch || topMatch.score < CONFIDENCE_THRESHOLD) {
      return {
        matchFound: false,
        topDocument: null,
        results: [],
        score: topMatch ? topMatch.score : 0
      };
    }

    const validResults = scoredDocs
      .filter(item => item.score >= CONFIDENCE_THRESHOLD)
      .slice(0, limit)
      .map(item => ({
        ...item.doc,
        relevanceScore: Math.round(item.score * 100) / 100
      }));

    return {
      matchFound: true,
      topDocument: validResults[0],
      results: validResults,
      score: topMatch.score
    };
  }

  /**
   * Internal tokenization & normalization
   */
  _tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1 && !this._isStopword(t));
  }

  _isStopword(term) {
    const stopwords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'to', 'for', 'of',
      'with', 'by', 'it', 'this', 'that', 'are', 'was', 'be', 'as', 'from', 'my', 'your', 'me'
    ]);
    return stopwords.has(term);
  }

  /**
   * Multi-factor scoring combining exact phrase match, keyword overlap, title similarity, and state awareness
   */
  _computeRelevanceScore(rawQuery, queryTokens, doc, normalizedState) {
    let score = 0;

    const titleLower = doc.title.toLowerCase();
    const contentLower = doc.content.toLowerCase();
    const docState = (doc.state || 'ALL').toLowerCase();
    const keywords = (doc.keywords || []).map(k => k.toLowerCase());

    // Factor A: Exact phrase match in keywords (High Boost)
    for (const kw of keywords) {
      if (rawQuery === kw || rawQuery.includes(kw) || kw.includes(rawQuery)) {
        score += 0.95;
        break;
      }
    }

    // Factor B: Keyword phrase partial overlap
    for (const kw of keywords) {
      const kwTokens = this._tokenize(kw);
      const overlap = kwTokens.filter(t => queryTokens.includes(t));
      if (kwTokens.length > 0) {
        const ratio = overlap.length / kwTokens.length;
        if (ratio > 0.6) {
          score += ratio * 0.5;
        }
      }
    }

    // Factor C: Title token matching
    const titleTokens = this._tokenize(titleLower);
    const titleOverlap = titleTokens.filter(t => queryTokens.includes(t));
    if (titleTokens.length > 0) {
      score += (titleOverlap.length / titleTokens.length) * 0.45;
    }

    // Factor D: Content token density
    let contentHits = 0;
    for (const token of queryTokens) {
      if (contentLower.includes(token)) {
        contentHits += 1;
      }
    }
    if (queryTokens.length > 0) {
      score += (contentHits / queryTokens.length) * 0.25;
    }

    // Factor E: Explicit category & state boosting
    if (doc.category === 'VOTING_GUIDANCE' && (rawQuery.includes('vote') || rawQuery.includes('receipt') || rawQuery.includes('verification'))) {
      score += 0.15;
    }
    if (doc.category === 'GENERAL_ELECTION_INFO' && (rawQuery.includes('constituency') || rawQuery.includes('active') || rawQuery.includes('upcoming') || rawQuery.includes('completed'))) {
      score += 0.15;
    }
    if (doc.category === 'ELECTION_CONDUCT' && (rawQuery.includes('conduct') || rawQuery.includes('mcc') || rawQuery.includes('neutrality') || rawQuery.includes('responsibilities'))) {
      score += 0.15;
    }
    
    // Strong state guideline match
    const isStateInquiry = rawQuery.includes('state') || rawQuery.includes('my state') || rawQuery.includes('guidelines') || rawQuery.includes(normalizedState);
    if (isStateInquiry) {
      if (doc.category === 'STATE_GUIDELINES' && docState === normalizedState) {
        score += 1.2;
      }
    }

    return score;
  }
}

export default new RagKnowledgeService();
