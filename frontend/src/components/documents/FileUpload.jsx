import { useRef, useState } from "react";

function FileUpload({ onUpload, loading = false }) {
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setError("");

        if (
            file.type !== "application/pdf" ||
            !file.name.toLowerCase().endsWith(".pdf")
        ) {
            setSelectedFile(null);
            setError("Failed to upload PDF");
            e.target.value = "";
            return;
        }

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile || loading) return;

        setError("");

        try {
            await onUpload(selectedFile);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch {
            setError("Failed to upload PDF");
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full">
            <div className="rounded-2xl border border-dashed border-violet-400/30 bg-violet-500/5 p-6 text-center transition hover:border-violet-400/50">
                {/* Upload Icon */}
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 16V4" />
                        <path d="m7 9 5-5 5 5" />
                        <path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
                    </svg>
                </div>

                <h3 className="text-sm font-semibold text-slate-200">
                    Upload your PDF
                </h3>

                <p className="mt-2 text-xs text-slate-400">
                    Add documents to your knowledge base
                </p>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                />

                {/* Selected File */}
                {/* Selected File */}
                {selectedFile && (
                    <div className="mt-4 flex items-center justify-between gap-2 rounded-lg bg-violet-500/10 px-3 py-2">
                        <span className="min-w-0 truncate text-xs text-violet-200">
                            {selectedFile.name}
                        </span>

                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            disabled={loading}
                            aria-label="Remove selected PDF"
                            className="shrink-0 rounded-md px-2 py-1 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Choose PDF Button */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="mt-5 inline-flex items-center justify-center rounded-xl border border-violet-400/40 px-5 py-2.5 text-sm font-medium text-violet-200 transition hover:bg-violet-500/10 disabled:opacity-60"
                >
                    Choose PDF
                </button>

                {/* Send PDF Button */}
                {selectedFile && (
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={loading}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Processing...
                            </>
                        ) : (
                            "Send PDF"
                        )}
                    </button>
                )}

                <p className="mt-3 text-xs text-slate-500">PDF files only</p>
            </div>

            {/* Error Message */}
            {error && (
                <p
                    role="alert"
                    className="mt-3 text-center text-xs text-red-400"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

export default FileUpload;
