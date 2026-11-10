// 1.
// npm install @pinecone-database/pinecone

// 2.
// npm install @pinecone-database/pinecone --legacy-peer-deps

// import { Pinecone } from "@pinecone-database/pinecone";
import { pineconeIndex as index } from '../config/pinecone.js';

// // 1. Setting up client
// const pinecone = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY,
// });

// // 2. host
// const index = pinecone.index({
//   host: process.env.PINECONE_INDEX_HOST,
// });

// export const storeVectors = async ({
// 	documentId,
// 	fileName,
// 	chunks,
// 	embeddings,
// }) => {
// 	if (chunks.length !== embeddings.length) {
// 		throw new Error('Chunks and embeddings count mismatch');
// 	}

// 	// 1. Prepare vector records
// 	const documents = chunks.map((chunk, i) => ({
// 		_id: `${documentId}-${i}`,
// 		values: embeddings[i],
// 		chunk_text: chunk,
// 		documentId,
// 		fileName,
// 		chunkIndex: i,
// 	}));

// 	// Using vectors
// 	// const vectors = chunks.map((chunk, i) => ({
// 	// 	id: `${documentId}-${i}`,
// 	// 	values: embeddings[i],
// 	// 	metadata: {
// 	// 		documentId,
// 	// 		fileName,
// 	// 		chunkIndex: i,
// 	// 		text: chunk,
// 	// 	},
// 	// }));

// 	const BATCH_SIZE = 100;

// 	for (let i = 0; i < documents.length; i += BATCH_SIZE) {
// 		const batch = documents.slice(i, i + BATCH_SIZE);

// 		await index.documents.upsert({
// 			documents: batch,
// 		});
// 	}

// 	return {
// 		storedCount: documents.length,
// 	};
// };

export const storeVectors = async ({
	documentId,
	fileName,
	chunks,
	embeddings,
}) => {
	if (!chunks?.length || !embeddings?.length) {
		throw new Error('Chunks and embeddings are required');
	}

	if (chunks.length !== embeddings.length) {
		throw new Error('Chunks and embeddings count mismatch');
	}

	const documents = chunks.map((chunk, i) => ({
		_id: `${documentId}-${i}`,
		text: chunk,
		documentId,
		fileName,
		chunkIndex: i,
	}));

	const BATCH_SIZE = 100;

	for (let i = 0; i < documents.length; i += BATCH_SIZE) {
		const batch = documents.slice(i, i + BATCH_SIZE);

		await index.documents.upsert({
			documents: batch,
		});
	}

	return {
		storedCount: documents.length,
	};
};



/**	when I am using vectors it is giving this errors
 * Error: PineconeBadRequestError: This index has a document schema, so writes must go through the documents API. Use POST /namespaces/{namespace}/documents/upsert, /update or /delete with the X-Pinecone-API-Version header set to 2026-07 or later. The vectors and records write endpoints do not support document schemas. If you are using a client library or integration that only supports the vectors API, upgrade it to a version that supports the documents API.
    at mapHttpStatusError (D:\GitHub Repository\RAG-MVP\backend\node_modules\@pinecone-database\pinecone\dist\errors\http.js:304:20)
    at handleApiError (D:\GitHub Repository\RAG-MVP\backend\node_modules\@pinecone-database\pinecone\dist\errors\handling.js:17:46)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async Object.post (D:\GitHub Repository\RAG-MVP\backend\node_modules\@pinecone-database\pinecone\dist\utils\middleware.js:148:29)
    at async VectorOperationsApi.fetchApi (D:\GitHub Repository\RAG-MVP\backend\node_modules\@pinecone-database\pinecone\dist\pinecone-generated-ts-fetch\db_data\runtime.js:200:28)
    at async VectorOperationsApi.request (D:\GitHub Repository\RAG-MVP\backend\node_modules\@pinecone-database\pinecone\dist\pinecone-generated-ts-fetch\db_data\runtime.js:113:26)
    at async VectorOperationsApi.upsertVectorsRaw (D:\GitHub Repository\RAG-MVP\backend\node_modules\@pinecone-database\pinecone\dist\pinecone-generated-ts-fetch\db_data\apis\VectorOperationsApi.js:425:26)
    at async VectorOperationsApi.upsertVectors (D:\GitHub Repository\RAG-MVP\backend\node_modules\@pinecone-database\pinecone\dist\pinecone-generated-ts-fetch\db_data\apis\VectorOperationsApi.js:439:26)
    at async UpsertCommand.run (D:\GitHub Repository\RAG-MVP\backend\node_modules\@pinecone-database\pinecone\dist\data\vectors\upsert.js:30:9)
    at async Index.upsert (D:\GitHub Repository\RAG-MVP\backend\node_modules\@pinecone-database\pinecone\dist\data\index.js:305:16) {
  cause: undefined
}

//documents,
	const documents = chunks.map((chunk, i) => ({
		_id: `${documentId}-${i}`,
		values: embeddings[i],
		chunk_text: chunk,
		documentId,
		fileName,
		chunkIndex: i,
	}));

	* but when I chenge it to documents it woeking fine now
 */
