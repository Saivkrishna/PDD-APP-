/**
 * backend/services/ats/semanticMatcher.js
 * Computes semantic text similarity using a cached local sentence-transformer ONNX model.
 */

let pipeline = null;
let extractorPromise = null;

// Lazy-loads the feature-extraction pipeline and caches it
function getExtractor() {
  if (!extractorPromise) {
    try {
      // Lazy load transformers package
      const transformers = require('@xenova/transformers');
      pipeline = transformers.pipeline;
      console.log('[Semantic Matcher] Initializing model load Xenova/all-MiniLM-L6-v2...');
      extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    } catch (err) {
      console.error('[Semantic Matcher] Failed to initialize transformers pipeline:', err.message);
      extractorPromise = Promise.reject(err);
    }
  }
  return extractorPromise;
}

/**
 * Computes vector embedding for a given text.
 * @param {string} text - Input text.
 * @returns {Promise<Array<number>>} Embedding vector.
 */
async function getEmbedding(text) {
  const pipe = await getExtractor();
  const output = await pipe(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

/**
 * Computes the cosine similarity between two vectors.
 * @param {Array<number>} vecA - First vector.
 * @param {Array<number>} vecB - Second vector.
 * @returns {number} Cosine similarity.
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0.0;
  
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0.0 || normB === 0.0) return 0.0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Computes a 0-100 similarity score between two text blocks.
 * @param {string} textA - First text block.
 * @param {string} textB - Second text block.
 * @returns {Promise<number>} Score from 0 to 100.
 */
async function getSemanticScore(textA, textB) {
  if (!textA || !textB || !textA.trim() || !textB.trim()) {
    return 0;
  }

  try {
    const embedA = await getEmbedding(textA);
    const embedB = await getEmbedding(textB);
    const similarity = cosineSimilarity(embedA, embedB);

    // Normalize cosine similarity from [0.15, 0.50] range to [0, 100] for user-friendly scores
    const minSim = 0.15;
    const maxSim = 0.50;
    const scaled = (similarity - minSim) / (maxSim - minSim);
    const score = Math.max(0, Math.min(100, Math.round(scaled * 100)));
    return score;
  } catch (err) {
    console.error('[Semantic Matcher] Error calculating semantic score:', err.message);
    return 0;
  }
}

module.exports = {
  getExtractor,
  getEmbedding,
  cosineSimilarity,
  getSemanticScore
};
