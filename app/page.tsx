"use client";

import { useState, useEffect } from "react";
import { uploadDocument, getDocuments, getExtraction, Document, Extraction } from "@/lib/api";

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [extractions, setExtractions] = useState<Record<string, Extraction>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      const docs = await getDocuments();
      setDocuments(docs);
    };
    fetchDocs();
    const interval = setInterval(fetchDocs, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchExtractions = async () => {
      const completedDocIds = documents
        .filter((doc) => doc.status === "COMPLETED" && !extractions[doc.id])
        .map((doc) => doc.id);

      const promises = completedDocIds.map(async (id) => {
        try {
          const data = await getExtraction(id);
          return { id, data };
        } catch { return null; }
      });

      const results = await Promise.all(promises);
      const newExtractions: Record<string, Extraction> = {};
      results.forEach((result) => {
        if (result) newExtractions[result.id] = result.data;
      });

      if (Object.keys(newExtractions).length > 0) {
        setExtractions((prev) => ({ ...prev, ...newExtractions }));
      }
    };
    if (documents.length > 0) fetchExtractions();
  }, [documents, extractions]);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await uploadDocument(file);
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      alert("Upload failed. Check backend connection.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const activeDocs = documents.filter(d => d.status === "PENDING" || d.status === "PROCESSING");
  const completedDocs = documents.filter(d => d.status === "COMPLETED");
  const failedDocs = documents.filter(d => d.status === "FAILED");

  return (
    <div className="min-h-screen bg-gray-100 text-slate-900 font-sans antialiased">
      {/* Top Bar */}
      <header className="bg-slate-900 h-14 flex items-center px-6 shadow-lg z-50 relative">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 bg-indigo-500 rounded flex items-center justify-center text-white font-bold text-xs">E</div>
            <span className="text-white font-semibold tracking-tight">ExtractIQ</span>
            <span className="text-slate-400 text-xs border-l border-slate-700 pl-3 ml-1">Enterprise Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"></div>
              System Online
            </div>
            
            <input type="file" id="file-upload" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium transition-all ${
                isUploading ? "bg-slate-700 text-slate-400 cursor-wait" : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
              }`}>
                {isUploading ? "Processing..." : "New Upload"}
              </div>
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Zone - Compact Enterprise Style */}
        <div 
          className={`bg-white border-2 border-dashed rounded-lg p-6 mb-8 flex items-center justify-center transition-all ${
            dragActive ? "border-indigo-500 bg-indigo-50/50" : "border-slate-300 hover:border-slate-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-3 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <div>
              <span className="font-semibold text-slate-700">Drop files here</span> or click to browse
              <p className="text-xs text-slate-400 mt-0.5">Supports PDF, JPG, PNG</p>
            </div>
          </label>
        </div>

        {/* Active Processing Queue */}
        {activeDocs.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Active Processing Queue ({activeDocs.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeDocs.map((doc) => (
                <div key={doc.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{doc.filename}</p>
                    <p className="text-xs text-slate-400">Sent to AI Pipeline...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extracted Data Table (Completed) */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Extraction Results ({completedDocs.length})</h3>
            {failedDocs.length > 0 && (
              <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {failedDocs.length} Failed
              </span>
            )}
          </div>

          {completedDocs.length === 0 && failedDocs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No processed documents yet. Upload a file to begin.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {completedDocs.map((doc) => (
                <div key={doc.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-6">
                    {/* Metadata */}
                    <div className="w-1/3 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 bg-slate-100 rounded">
                          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <span className="text-sm font-medium text-slate-900 truncate">{doc.filename}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-6">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">COMPLETED</span>
                      </div>
                    </div>

                    {/* JSON Data Panel */}
                    <div className="w-2/3 bg-slate-900 rounded-md p-4 font-mono text-sm overflow-x-auto">
                      {extractions[doc.id] ? (
                        <pre className="text-emerald-400 font-jetbrains text-xs leading-relaxed">
{JSON.stringify(extractions[doc.id].extracted_data, null, 2)}
                        </pre>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <div className="animate-spin h-3 w-3 border-2 border-slate-600 border-t-transparent rounded-full"></div>
                          Loading payload...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Failed Items (Collapsed style) */}
              {failedDocs.map((doc) => (
                <div key={doc.id} className="px-6 py-3 bg-red-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-red-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {doc.filename}
                  </div>
                  <span className="text-xs font-medium text-red-500">EXTRACTION FAILED</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}