import { queryEmbeddingModel } from "../config/gemini.js";
import { pineconeIndex } from "../config/pinecone.js";

export const retrieveRelevantChunks = async (query) => {
  // 1. Generate embedding for user's query
  const queryVector = await queryEmbeddingModel.embedQuery(query);

  // 2. Search across all vectors in the namespace
  const result = await pineconeIndex.query({
    vector: queryVector,
    topK: 5,
    includeMetadata: true,
  });

  // 3. Extract relevant chunks
  const chunks = (result.matches ?? [])
    .filter((match) => typeof match.metadata?.text === "string")
    .map((match) => ({
      id: match.id,
      text: match.metadata.text,
      documentId: match.metadata.documentId,
      chunkIndex: match.metadata.chunkIndex,
      score: match.score,
    }));

  return chunks;
};