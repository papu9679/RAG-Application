import { pinecone, pineconeIndex } from "../config/pinecone.js";

let cachedIndexInfo = null;

export const getIndexInfo = async () => {
  if (cachedIndexInfo) return cachedIndexInfo;

  try {
    const host = process.env.PINECONE_INDEX_HOST || "";
    const list = await pinecone.listIndexes();
    const matched = list.indexes?.find(
      (idx) => host.includes(idx.host) || (idx.name && host.includes(idx.name))
    );

    if (matched?.schema) {
      const hasDenseEmbedding = Boolean(matched.schema.fields?.embedding);
      const chunkTextField = matched.schema.fields?.chunk_text;
      const hasIntegratedEmbed = Boolean(chunkTextField?.embed);

      cachedIndexInfo = {
        indexName: matched.name,
        hasDocumentSchema: true,
        hasDenseEmbedding,
        hasIntegratedEmbed,
        denseFieldName: hasDenseEmbedding ? "embedding" : null,
        textFieldName: hasIntegratedEmbed ? "chunk_text" : "text",
        dimension:
          matched.schema.fields?.embedding?.dimension ||
          chunkTextField?.embed?.dimension ||
          768,
      };
      return cachedIndexInfo;
    }

    cachedIndexInfo = {
      indexName: matched?.name,
      hasDocumentSchema: false,
      hasDenseEmbedding: false,
      hasIntegratedEmbed: false,
      dimension: matched?.dimension || 768,
    };
    return cachedIndexInfo;
  } catch (error) {
    console.warn(
      "Could not inspect Pinecone index schema, defaulting to document schema with dense embedding:",
      error.message
    );
    cachedIndexInfo = {
      hasDocumentSchema: true,
      hasDenseEmbedding: true,
      hasIntegratedEmbed: false,
      denseFieldName: "embedding",
      textFieldName: "text",
      dimension: 768,
    };
    return cachedIndexInfo;
  }
};

export const storeVectors = async ({
  documentId,
  fileName,
  chunks,
  embeddings,
}) => {
  if (!chunks?.length || !embeddings?.length) {
    throw new Error("Chunks and embeddings are required");
  }

  if (chunks.length !== embeddings.length) {
    throw new Error("Chunks and embeddings count mismatch");
  }

  const info = await getIndexInfo();
  const BATCH_SIZE = 100;

  if (info.hasDocumentSchema) {
    // Pinecone index with Document Schema (Documents API)
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batchChunks = chunks.slice(i, i + BATCH_SIZE);
      const batchEmbeddings = embeddings.slice(i, i + BATCH_SIZE);

      const batch = batchChunks.map((chunk, idx) => {
        const chunkIndex = i + idx;
        const docRecord = {
          _id: `${documentId}-${chunkIndex}`,
          documentId,
          fileName,
          chunkIndex,
        };

        if (info.hasDenseEmbedding) {
          docRecord.embedding = batchEmbeddings[idx];
          docRecord.text = chunk;
        } else if (info.hasIntegratedEmbed) {
          docRecord.chunk_text = chunk;
        } else {
          docRecord.text = chunk;
        }

        return docRecord;
      });

      await pineconeIndex.documents.upsert({
        documents: batch,
      });
    }
  } else {
    // Legacy vector index without document schema (Vectors API)
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batchChunks = chunks.slice(i, i + BATCH_SIZE);
      const batchEmbeddings = embeddings.slice(i, i + BATCH_SIZE);

      const batch = batchChunks.map((chunk, idx) => {
        const chunkIndex = i + idx;
        return {
          id: `${documentId}-${chunkIndex}`,
          values: batchEmbeddings[idx],
          metadata: {
            documentId,
            fileName,
            chunkIndex,
            text: chunk,
          },
        };
      });

      await pineconeIndex.upsert({
        records: batch,
      });
    }
  }

  return {
    storedCount: chunks.length,
  };
};
