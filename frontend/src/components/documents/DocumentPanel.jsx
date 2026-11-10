import FileUpload from "./FileUpload.jsx";
import DocumentItem from "./DocumentItem.jsx";

function DocumentPanel({
  documents = [],
  onUpload,
  uploadLoading = false,
}) {
  const indexedCount = documents.filter(
    (document) => document.status === "indexed"
  ).length;

  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* Panel Header */}
      <div className="shrink-0 border-b border-violet-400/10 px-5 py-5">
        <h2 className="text-lg font-semibold text-slate-100">
          Documents
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Manage your knowledge base
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="min-h-0 flex-1 overflow-y-auto p-5">

        {/* PDF Upload */}
        <FileUpload
          onUpload={onUpload}
          loading={uploadLoading}
        />

        {/* Document List */}
        <div className="mt-8">

          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Uploaded Documents
            </h3>

            <span className="rounded-lg border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-300">
              {indexedCount}
            </span>
          </div>

          {documents.length === 0 ? (
            /* Empty State */
            <div className="rounded-xl border border-violet-400/10 bg-[#1b2040]/40 px-4 py-8 text-center">
              <p className="text-sm text-slate-400">
                No documents uploaded yet.
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Upload a PDF to get started.
              </p>
            </div>
          ) : (
            /* Uploaded PDFs */
            <div className="flex flex-col gap-3">
              {documents.map((document) => (
                <DocumentItem
                  key={document.id}
                  document={document}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default DocumentPanel;