function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed wrap-break-word sm:max-w-[75%] ${
          isUser
            ? "rounded-br-md border border-violet-400/20 bg-violet-600/25 text-violet-50"
            : "rounded-bl-md border border-white/10 bg-[#1b2040]/90 text-slate-200"
        }`}
      >
        {/* AI Label */}
        {!isUser && (
          <div className="mb-2 flex items-center gap-2">
            <span className="text-base text-violet-400">✦</span>
            <span className="text-xs font-semibold text-violet-300">
              AI Assistant
            </span>
          </div>
        )}

        {/* Message Content */}
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

export default ChatMessage;