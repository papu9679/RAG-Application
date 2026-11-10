import { randomUUID } from "node:crypto";
import Document from '../models/document.model.js';
import { processPDF } from "../services/pdf.service.js";
import { chunkText } from "../services/chunk.service.js";
import { generateEmbeddings } from "../services/embedding.service.js";
import { storeVectors } from "../services/vector.service.js";
import { deleteFile } from "../utils/file.util.js";


export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    const documentId = randomUUID();

    // 1. Extract text from PDF
    const text = await processPDF(req.file.path);

    // 2. Split text into chunks
    const chunks = await chunkText(text);

    if (chunks.length === 0) {
      return res.status(422).json({
        success: false,
        message: "No extractable text found in PDF",
      });
    }

    // 3. Generate embeddings
    const embeddings = await generateEmbeddings(chunks);

    // 4. Store vectors in Pinecone
    await storeVectors({
      documentId,
      fileName: req.file.originalname,
      chunks,
      embeddings,
    });

    // 5. Saving to MongoDB fileName - documentID - for future use
    const doc = {fileName : req.file.originalname, documentId};
    await Document.insertOne(doc);

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: {
        documentId,
        totalChunks: chunks.length,
      },
    });
  }
  catch (error) {
      next(error);
  }
  finally {
    // Delete temporary PDF
    await deleteFile(req.file?.path);
  }
};