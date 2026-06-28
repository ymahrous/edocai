"use client";

import { useState, useEffect } from "react";
import { uploadDocument, getDocuments, getExtraction, Document, Extraction, logout, isTokenExpired } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers/ThemeContext";

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [extractions, setExtractions] = useState<Record<string, Extraction>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); } 
      else { setIsAuthenticated(true); setIsLoading(false); }
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let controller = new AbortController();

    const fetchDocs = async () => {
      controller.abort();
      controller = new AbortController();
      try {
        const docs = await getDocuments(controller.signal);
        setDocuments(docs);
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        console.error(e);
      }
    };

    fetchDocs();
    const interval = setInterval(fetchDocs, 3000);

    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSession = () => {
      if (isTokenExpired()) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    // Check immediately and then every 60 seconds
    checkSession();
    const interval = setInterval(checkSession, 60_000);
    return () => clearInterval(interval);
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchExtractions = async () => {
      const completedDocIds = documents.filter((doc) => doc.status === "COMPLETED" && !extractions[doc.id]).map((doc) => doc.id);
      const promises = completedDocIds.map(async (id) => { try { const data = await getExtraction(id); return { id, data }; } catch { return null; } });
      const results = await Promise.all(promises);
      const newExtractions: Record<string, Extraction> = {};
      results.forEach((result) => { if (result) newExtractions[result.id] = result.data; });
      if (Object.keys(newExtractions).length > 0) setExtractions((prev) => ({ ...prev, ...newExtractions }));
    };
    if (documents.length > 0) fetchExtractions();
  }, [documents, extractions, isAuthenticated]);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try { await uploadDocument(file); const docs = await getDocuments(); setDocuments(docs); } 
    catch (error) { alert("Upload failed."); } 
    finally { setIsUploading(false); }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleUpload(e.dataTransfer.files[0]);
  };

  const activeDocs = documents.filter(d => d.status === "PENDING" || d.status === "PROCESSING");
  const completedDocs = documents.filter(d => d.status === "COMPLETED");
  const failedDocs = documents.filter(d => d.status === "FAILED");

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className={`min-h-screen pb-20 ${isDark ? "bg-black" : "bg-gray-50"}`}>
      <div className="max-w-5xl mx-auto px-6 pt-24">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>Documents</h1>
          <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Upload invoices to extract structured data via AI.</p>
        </div>

        {/* Upload Zone - Frosted Glass */}
        <div 
          className={`border-2 border-dashed rounded-2xl p-12 mb-12 flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
            dragActive 
              ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]" 
              : isDark 
                ? "border-white/10 bg-white/5 hover:bg-white/10" 
                : "border-gray-300 bg-white hover:border-gray-400"
          }`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        >
          <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
              <svg className={`w-8 h-8 ${isDark ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <div>
              <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Drop files here or <span className="text-indigo-500">browse</span>
              </p>
              <p className={`text-sm ${isDark ? "text-gray-600" : "text-gray-400"}`}>PDF, JPG, PNG up to 10MB</p>
            </div>
          </label>
          <input type="file" id="file-upload" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
        </div>

        {/* Active Queue */}
        {activeDocs.length > 0 && (
          <div className="mb-10">
            <h2 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Processing ({activeDocs.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDocs.map((doc) => (
                <div key={doc.id} className={`p-5 rounded-2xl border backdrop-blur-sm ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
                  <div className="flex items-center gap-3">
                    <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                    <span className={`text-sm font-medium truncate ${isDark ? "text-gray-300" : "text-gray-700"}`}>{doc.filename}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className={`rounded-2xl border overflow-hidden backdrop-blur-sm ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
          <div className={`px-8 py-5 border-b flex items-center justify-between ${isDark ? "border-white/10" : "border-gray-200"}`}>
            <h2 className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Results ({completedDocs.length})</h2>
            {failedDocs.length > 0 && <span className="text-xs text-red-500 font-medium">{failedDocs.length} Failed</span>}
          </div>

          {completedDocs.length === 0 ? (
            <div className={`p-16 text-center text-sm ${isDark ? "text-gray-600" : "text-gray-400"}`}>No results yet.</div>
          ) : (
            <div className={`divide-y ${isDark ? "divide-white/10" : "divide-gray-100"}`}>
              {completedDocs.map((doc) => (
                <div key={doc.id} className={`p-8 transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}>
                  <div className="flex flex-col md:flex-row md:items-start gap-8">
                    <div className="md:w-1/3 min-w-0">
                      <p className={`text-sm font-medium truncate mb-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>{doc.filename}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
                        COMPLETED
                      </span>
                    </div>
                    <div className="md:w-2/3 bg-black/80 rounded-xl p-5 border border-white/5">
                      {extractions[doc.id] ? (
                        <pre className="text-emerald-400 font-jetbrains text-xs leading-loose">
{JSON.stringify(extractions[doc.id].extracted_data, null, 2)}
                        </pre>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-600 text-xs">
                          <div className="animate-spin h-3 w-3 border-2 border-gray-600 border-t-transparent rounded-full"></div>
                          Analyzing...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}