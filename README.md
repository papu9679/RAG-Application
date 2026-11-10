# 📚 RAG-MVP — AI-Powered PDF Chatbot

An AI-powered PDF chatbot that lets users upload documents and ask questions in natural language. Built using **Retrieval-Augmented Generation (RAG)**, it retrieves relevant information from uploaded PDFs and generates context-aware responses using LLMs.

<p align="center">
  <a href="https://rag-mvp-phi.vercel.app/">
    <strong>🚀 Live Demo</strong>
  </a>
  ·
  <a href="https://github.com/Azmat2003/RAG-MVP">
    <strong>📂 GitHub Repository</strong>
  </a>
  ·
  <a href="https://app.notion.com/p/RAG-4034aaa4c84780f9a42ee91421587d6b?source=copy_link">
    <strong>📖 Documentation & Learning Material</strong>
  </a>
</p>

---

## ✨ Features

- **📄 PDF Upload:** Upload PDF documents (up to 10 MB) to build a document knowledge base.
- **✂️ Intelligent Text Chunking:** Extracts PDF content and splits it into smaller chunks for efficient retrieval.
- **🧠 Semantic Embeddings:** Generates vector embeddings using Google's Gemini Embedding API.
- **🗄️ Vector Storage:** Stores document embeddings in Pinecone for efficient similarity-based retrieval.
- **🔍 Context-Aware Retrieval:** Retrieves relevant document chunks based on the user's query.
- **💬 AI-Powered Conversations:** Generates contextual answers using retrieved document information and an LLM.
- **📁 Document Management:** View and manage uploaded documents through a dedicated panel.
- **🆕 New Chat:** Start a fresh conversation without re-uploading indexed documents.
- **📱 Responsive Interface:** Clean, modern interface designed for desktop and mobile devices.

## 🏗️ How It Works

The application follows a Retrieval-Augmented Generation (RAG) pipeline.

### 1. Document Ingestion

- User uploads a PDF document.
- Backend extracts text from the PDF.
- Extracted content is divided into smaller chunks.
- Each chunk is converted into a vector embedding using Gemini.

### 2. Vector Storage

- Generated embeddings are stored in Pinecone.
- Each vector maintains associated metadata, including document information and its corresponding text chunk.
- This enables efficient semantic similarity searches.

### 3. Query Processing

- User submits a question through the chat interface.
- The question is converted into an embedding.
- Pinecone performs similarity search to retrieve the most relevant document chunks.

### 4. Response Generation

- Retrieved chunks are passed as contextual information to the LLM.
- The model generates a response grounded in the retrieved document content.
- The generated answer is displayed in the chat interface.

### RAG Pipeline

```text
          PDF Upload
               ↓
        PDF Text Extraction
               ↓
          Text Chunking
               ↓
       Gemini Embeddings
               ↓
       Pinecone Vector DB
               ↓
          User Query
               ↓
        Query Embedding
               ↓
       Similarity Search
               ↓
       Relevant Text Chunks
               ↓
       LLM + Retrieved Context
               ↓
        Contextual Answer
```

## 🛠️ Tech Stack

| Category         | Technologies            |
| ---------------- | ----------------------- |
| Frontend         | React.js, Vite          |
| Styling          | Tailwind CSS            |
| Backend          | Node.js, Express.js     |
| AI Framework     | LangChain               |
| LLM & Embeddings | Google Gemini API       |
| Vector Database  | Pinecone                |
| Deployment       | Vercel, Backend Hosting |

## 📂 Project Structure

```text
RAG-MVP/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── utils/
│   ├── uploads/
│   └── server.js
│
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or later)
- npm
- Google Gemini API Key
- Pinecone Account and API Key

### 1. Clone the Repository

```bash
git clone https://github.com/Azmat2003/RAG-MVP.git

cd RAG-MVP
```

### 2. Backend Setup

```bash
cd backend

npm install --legacy-peer-deps
```

Create a `.env` file in the backend directory:

```env
PORT=5000
GEMINI_CHAT_MODEL=gemini-3.5-flash-lite
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI = your_monogo_db_uri
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index_name
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install
```

Create a `.env` file:

```env
VITE_BACKEND_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the application at the local URL provided by Vite.

*Note: Adjust environment variable names, scripts, and directory paths according to the project configuration.*

## 🔐 Environment Variables

| Variable                | Description                      |
| ----------------------- | -------------------------------- |
| `GEMINI_API_KEY`        | Google Gemini API authentication |
| `PINECONE_API_KEY`      | Pinecone API authentication      |
| `PINECONE_INDEX`        | Pinecone index name              |
| `PORT`                  | Backend server port              |
| `VITE_BACKEND_BASE_URL` | Backend API base URL             |

## 🚀 Deployment

The application is deployed using:

- **Frontend:** Vercel
- **Backend:** Configure the deployed backend URL through the frontend environment variable.

Try the live application:

👉 [https://rag-mvp-phi.vercel.app/](https://rag-mvp-phi.vercel.app/)

## 🎯 Key Learnings

Building this project involved working with several important concepts:

- Understanding the complete Retrieval-Augmented Generation architecture.
- Implementing document ingestion and text chunking pipelines.
- Generating and managing high-dimensional vector embeddings.
- Integrating Pinecone for semantic similarity search.
- Connecting LLMs with retrieved contextual information.
- Handling large document ingestion and embedding batches.
- Building a modular full-stack application with React and Express.

## 👨‍💻 Author

**Azmat Matin Shadab**

- GitHub: [@Azmat2003](https://github.com/Azmat2003)
- Project: [RAG-MVP](https://github.com/Azmat2003/RAG-MVP)
- Live Demo: [RAG-MVP](https://rag-mvp-phi.vercel.app/)

---

\<p align="center">
&#x20; Built with ❤️ using React, Node.js, LangChain, Gemini and Pinecone.
\</p>