
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    documentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    }
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
