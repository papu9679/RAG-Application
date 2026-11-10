import { queryEmbeddingModel } from "../config/gemini.js";
import { pineconeIndex } from "../config/pinecone.js";
import { getIndexInfo } from "./vector.service.js";

export const retrieveRelevantChunks = async (query) => {
  const info = await getIndexInfo();

  if (info.hasDocumentSchema) {
    let scoreBy;

    if (info.hasDenseEmbedding) {
      const queryVector = await queryEmbeddingModel.embedQuery(query);
      scoreBy = [
        {
          type: "dense_vector",
          field: info.denseFieldName || "embedding",
          values: queryVector,
        },
      ];
    } else if (info.hasIntegratedEmbed) {
      scoreBy = [
        {
          type: "embed",
          field: "chunk_text",
          query,
        },
      ];
    } else {
      scoreBy = [
        {
          type: "text",
          field: info.textFieldName || "text",
          query,
        },
      ];
    }

    const result = await pineconeIndex.documents.search({
      topK: 5,
      includeFields: [
        "text",
        "chunk_text",
        "documentId",
        "fileName",
        "chunkIndex",
      ],
      scoreBy,
    });

    const chunks = (result.matches ?? [])
      .map((match) => ({
        id: match._id || match.id,
        text: match.text || match.chunk_text || match.metadata?.text || "",
        documentId: match.documentId || match.metadata?.documentId,
        chunkIndex: match.chunkIndex ?? match.metadata?.chunkIndex,
        score: match._score ?? match.score,
      }))
      .filter((chunk) => Boolean(chunk.text));

    return chunks;
  }

  // Legacy vector index search
  const queryVector = await queryEmbeddingModel.embedQuery(query);
  const result = await pineconeIndex.query({
    vector: queryVector,
    topK: 5,
    includeMetadata: true,
  });

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
