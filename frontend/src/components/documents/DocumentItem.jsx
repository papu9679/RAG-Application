function DocumentItem({ document }) {
  const { fileName, status } = document;

  const isProcessing = status === "processing";
  const isIndexed = status === "indexed";
  const isFailed = status === "failed";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-violet-400/10 bg-[#1b2040]/60 p-3 transition hover:border-violet-400/20">

      {/* PDF Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      </div>

      {/* Document Details */}
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-medium text-slate-200"
          title={fileName}
        >
          {fileName}
        </p>

        <div className="mt-1 flex items-center gap-1.5">
          {isProcessing && (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400" />
              <span className="text-xs text-violet-300">
                Processing...
              </span>
            </>
          )}

          {isIndexed && (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400">
                Indexed
              </span>
            </>
          )}

          {isFailed && (
            <>
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="text-xs text-red-400">
                Failed
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentItem;