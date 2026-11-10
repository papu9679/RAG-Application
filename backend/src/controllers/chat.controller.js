import { generateChatAnswer } from "../services/chat.service.js";

export const sendChatMessage = async (req, res, next) => {
// {
//   "message": "What is machine learning?",
//   "history": []
// }
  try {
    const { message, history = [] } = req.body;

    // Validate user message
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid message is required",
      });
    }

    // Validate chat history
    if (
      !Array.isArray(history) ||
      history.length > 20 ||
      history.some(
        (item) =>
          !item ||
          !["user", "assistant"].includes(item.role) ||
          typeof item.content !== "string"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat history",
      });
    }

    // Call chat service
    const result = await generateChatAnswer({
      message: message.trim(),
      history,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};