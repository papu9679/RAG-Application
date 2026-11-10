import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage.jsx';
import ChatInput from './ChatInput.jsx';

function ChatBox({ messages = [], onSendMessage, loading = false }) {
	const bottomRef = useRef(null);

	// Scroll to latest message
	useEffect(() => {
		bottomRef.current?.scrollIntoView({
			behavior: 'smooth',
		});
	}, [messages, loading]);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			{/* Chat Messages Area */}
			<div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
				<div className="mx-auto flex min-h-full max-w-3xl flex-col">
					{messages.length === 0 ? (
						/* Welcome Screen */
						<div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
							<div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-3xl text-violet-300 shadow-lg shadow-violet-950/20">
								✦
							</div>

							<h2 className="bg-gradient-to-r from-blue-300 via-violet-300 to-purple-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
								Chat with your documents
							</h2>

							<p className="max-w-md text-sm leading-relaxed text-slate-400">
								Upload your PDFs and ask questions. Get AI-powered answers based
								on your documents.
							</p>
						</div>
					) : (
						/* Conversation */
						<div className="flex flex-col gap-5">
							{messages.map((message, index) => (
								<ChatMessage key={message.id ?? index} message={message} />
							))}
						</div>
					)}

					{/* AI Typing Indicator */}
					{loading && (
						<div
							className="mt-5 flex items-center gap-3"
							role="status"
							aria-label="AI is generating a response"
						>
							<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
								✦
							</div>

							<div className="flex items-center gap-1.5 rounded-2xl border border-violet-400/10 bg-[#1b2040]/90 px-4 py-3">
								{[0, 1, 2].map((dot) => (
									<span
										key={dot}
										className="h-2 w-2 animate-bounce rounded-full bg-violet-400"
										style={{
											animationDelay: `${dot * 150}ms`,
										}}
									/>
								))}
							</div>
						</div>
					)}

					<div ref={bottomRef} />
				</div>
			</div>

			{/* Chat Input */}
			<div className="shrink-0 border-t border-violet-400/10 bg-[#10152b]/60 px-4 py-4 backdrop-blur-md sm:px-6">
				<div className="mx-auto max-w-3xl">
					<ChatInput onSendMessage={onSendMessage} loading={loading} />

					<p className="mt-2 text-center text-xs text-slate-500">
						Answers are generated using your uploaded documents.
					</p>
				</div>
			</div>
		</div>
	);
}

export default ChatBox;
