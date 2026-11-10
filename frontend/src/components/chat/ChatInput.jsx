import { useRef, useState } from "react";

function ChatInput({ onSendMessage, loading = false }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = input.trim();

    if (!message || loading) return;

    onSendMessage(message);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // Auto-expand textarea
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 rounded-2xl border border-violet-400/20 bg-[#1b2040]/90 p-3 shadow-lg shadow-violet-950/20 transition focus-within:border-violet-400/50"
    >
      {/* Message Input */}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about your documents..."
        rows={1}
        disabled={loading}
        className="max-h-40 min-h-10 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 disabled:opacity-60"
      />

      {/* Send Button */}
      <button
        type="submit"
        disabled={!input.trim() || loading}
        aria-label="Send message"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
        )}
      </button>
    </form>
  );
}

export default ChatInput;