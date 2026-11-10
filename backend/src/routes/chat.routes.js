import express from "express";
import { sendChatMessage } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", sendChatMessage);

export default router;