import { Router } from "express";
import {
  uploadDocument,
  getDocuments,
} from "../controllers/document.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getDocuments);
router.post("/upload", upload.single("file"), uploadDocument);

export default router;
