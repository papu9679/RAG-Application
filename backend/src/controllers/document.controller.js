import { randomUUID } from "node:crypto";
import Document from "../models/document.model.js";
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

    // 5. Saving to MongoDB fileName - documentId - for persistent metadata
    try {
      await Document.create({
        fileName: req.file.originalname,
        documentId,
      });
    } catch (dbError) {
      console.warn("MongoDB document record save warning:", dbError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: {
        documentId,
        fileName: req.file.originalname,
        totalChunks: chunks.length,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    // Delete temporary PDF from upload directory
    await deleteFile(req.file?.path);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: docs.map((doc) => ({
        id: doc.documentId,
        fileName: doc.fileName,
        status: "indexed",
        createdAt: doc.createdAt,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch documents from database:", error.message);
    return res.status(200).json({
      success: true,
      data: [],
    });
  }
};
