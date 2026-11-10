import React from "react";

function Sidebar({ onNewChat }) {
  return (
    <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-violet-400/10 bg-[#0d1228]/80 backdrop-blur-xl">

      {/* Branding */}
      <div className="px-5 py-6">
        <h1 className="text-xl font-bold tracking-tight text-violet-300">
          RAG Chatbot
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Chat with your documents
        </p>
      </div>

      {/* New Chat Button */}
      <div className="px-4">
        <button
          onClick={onNewChat}
          className="w-full rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-left text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
        >
          <span className="mr-2 text-lg">+</span>
          New Chat
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;