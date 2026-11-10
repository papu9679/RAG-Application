import express from "express";
import cors from "cors";
import connectDB from "./config/mongo.js";
import documentRoutes from "./routes/document.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// db connnection
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);

// Handle unknown routes
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

app.get('/', (req, res)=>{
  return res.status(200).json({
    message : "Server running"
  })
})

// Centralized Error Handler
app.use(errorHandler);

export default app;