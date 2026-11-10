import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from './components/layout/Sidebar.jsx';
import ChatBox from './components/chat/ChatBox.jsx';
import DocumentPanel from './components/documents/DocumentPanel.jsx';

import { sendMessage } from './services/chat.service.js';
import { getDocuments, uploadDocument } from './services/document.service.js';

const STORAGE_KEY = 'rag_uploaded_documents';

function App() {
	const [messages, setMessages] = useState([]);

	const [documents, setDocuments] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		} catch {
			return [];
		}
	});

	const [chatLoading, setChatLoading] = useState(false);
	const [uploadLoading, setUploadLoading] = useState(false);
	const [showDocuments, setShowDocuments] = useState(false);
	const chatRequestRef = useRef(0);

	// Persist document metadata
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
	}, [documents]);

	// Sync documents with backend on mount
	useEffect(() => {
		const loadDocs = async () => {
			try {
				const remoteDocs = await getDocuments();
				if (Array.isArray(remoteDocs) && remoteDocs.length > 0) {
					setDocuments((prev) => {
						const existingIds = new Set(prev.map((d) => d.id));
						const newDocs = remoteDocs.filter((d) => !existingIds.has(d.id));
						return [...prev, ...newDocs];
					});
				}
			} catch (err) {
				console.warn('Could not sync documents from server:', err);
			}
		};
		loadDocs();
	}, []);

	// New Chat
	const handleNewChat = () => {
		chatRequestRef.current += 1;
		setMessages([]);
		setChatLoading(false);
	};

	// Send message to RAG backend
	const handleSendMessage = async (question) => {
		if (chatLoading) return;

		const requestId = ++chatRequestRef.current;
		const history = [...messages];

		setMessages((prev) => [...prev, { role: 'user', content: question }]);

		setChatLoading(true);

		try {
			const result = await sendMessage(question, history);

			if (requestId !== chatRequestRef.current) return;

			setMessages((prev) => [
				...prev,
				{
					role: 'assistant',
					content: result.data.answer,
				},
			]);
		} catch (error) {
			if (requestId !== chatRequestRef.current) return;

			setMessages((prev) => [
				...prev,
				{
					role: 'assistant',
					content: error.message || 'Something went wrong. Please try again.',
				},
			]);
		} finally {
			if (requestId === chatRequestRef.current) {
				setChatLoading(false);
			}
		}
	};

	// Upload PDF to existing backend
	const handleUpload = async (file) => {
		if (uploadLoading) return;

		setUploadLoading(true);

		const toastId = toast.loading('Uploading PDF...');

		try {
			const result = await uploadDocument(file);

			const newDocument = {
				id: result.data.documentId,
				fileName: file.name,
				status: 'indexed',
			};

			setDocuments((prev) => {
				const filtered = prev.filter((d) => d.id !== newDocument.id);
				return [...filtered, newDocument];
			});

			toast.success('PDF uploaded successfully!', {
				id: toastId,
			});
		} catch (error) {
			toast.error(error.message || 'Failed to upload PDF', {
				id: toastId,
			});

			throw error;
		} finally {
			setUploadLoading(false);
		}
	};

	return (
		<div className="flex h-dvh overflow-hidden bg-linear-to-br from-[#080e23] via-[#171638] to-[#302052] text-slate-100">
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 3000,
					style: {
						background: '#1e1b4b',
						color: '#fff',
						border: '1px solid #6d28d9',
					},
				}}
			/>

			{/* Desktop Sidebar */}
			<Sidebar onNewChat={handleNewChat} />

			{/* Main Chat */}
			<main className="flex min-w-0 flex-1 flex-col bg-[#10152b]/40">
				{/* Header */}
				<header className="flex h-16 shrink-0 items-center justify-between border-b border-violet-400/10 px-4 sm:px-6">
					<h2 className="text-lg font-semibold">Chat</h2>

					<div className="flex items-center gap-2">
						{/* Mobile New Chat */}
						<button
							onClick={handleNewChat}
							className="rounded-lg bg-violet-500/10 px-3 py-2 text-xs text-violet-200 hover:bg-violet-500/20 md:hidden"
						>
							+ New Chat
						</button>

						{/* Mobile / Tablet Documents */}
						<button
							onClick={() => setShowDocuments(true)}
							className="rounded-lg border border-violet-400/20 bg-violet-500/10 px-3 py-2 text-xs text-violet-200 hover:bg-violet-500/20 lg:hidden"
						>
							Documents
						</button>
					</div>
				</header>

				{/* Chat Component */}
				<ChatBox
					messages={messages}
					onSendMessage={handleSendMessage}
					loading={chatLoading}
				/>
			</main>

			{/* Desktop Document Panel */}
			<aside className="hidden w-80 shrink-0 flex-col border-l border-violet-400/10 bg-[#14162e]/90 backdrop-blur-xl lg:flex">
				<DocumentPanel
					documents={documents}
					onUpload={handleUpload}
					uploadLoading={uploadLoading}
				/>
			</aside>

			{/* Mobile / Tablet Document Drawer */}
			{showDocuments && (
				<div className="fixed inset-0 z-50 flex justify-end lg:hidden">
					{/* Backdrop */}
					<button
						onClick={() => setShowDocuments(false)}
						aria-label="Close documents panel"
						className="absolute inset-0 bg-black/60"
					/>

					{/* Drawer */}
					<div className="relative flex h-full w-full max-w-sm flex-col border-l border-violet-400/20 bg-[#14162e] shadow-2xl">
						<button
							onClick={() => setShowDocuments(false)}
							aria-label="Close documents panel"
							className="absolute right-4 top-5 z-10 text-xl text-slate-400 hover:text-white"
						>
							✕
						</button>

						<DocumentPanel
							documents={documents}
							onUpload={handleUpload}
							uploadLoading={uploadLoading}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
