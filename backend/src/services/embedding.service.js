import { embeddingModel } from "../config/gemini.js";

export const generateEmbeddings = async (chunks) => {
  const BATCH_SIZE = 10;
  const embeddings = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const batchEmbeddings = await embeddingModel.embedDocuments(batch);

    // Validate and throw immediately if any embedding has dimension 0
    batchEmbeddings.forEach((emb, batchIdx) => {
      const absoluteIndex = i + batchIdx;
      if (!emb || !Array.isArray(emb) || emb.length === 0) {
        throw new Error(
          `Zero-dimension embedding generated at chunk index ${absoluteIndex}. ` +
          `Problematic text snippet: "${chunks[absoluteIndex]}"`
        );
      }
    });

    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
};
