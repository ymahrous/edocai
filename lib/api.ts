const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Document {
  id: string;
  filename: string;
  s3_url: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  created_at: string;
}

export interface Extraction {
  document_id: string;
  extracted_data: {
    vendor: string;
    total_amount: string;
    date: string;
  };
  confidence_score: number;
}

// --- AUTH FUNCTIONS ---
export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    mode: "cors", // EXPLICITLY tell browser this is a cross-origin request
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json" 
    },
    body: JSON.stringify({ username, password }),
  });
  
  if (!res.ok) {
    // Try to read the error message from the backend if possible
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Invalid credentials");
  }
  
  const data = await res.json();
  localStorage.setItem("token", data.access_token);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("storage"));
}

export function isTokenExpired(): boolean {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp is in seconds; Date.now() is in ms
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// --- PROTECTED FETCH WRAPPER ---
async function authFetch(url: string, options: RequestInit = {}) {
  if (isTokenExpired()) {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    throw new Error("Session expired");
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    throw new Error("Session expired");
  }

  return res;
}

// --- APP FUNCTIONS ---
export async function uploadDocument(file: File): Promise<Document> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await authFetch(`${API_URL}/upload/`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function getDocuments(): Promise<Document[]> {
  const res = await authFetch(`${API_URL}/documents/`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function getExtraction(documentId: string): Promise<Extraction> {
  const res = await authFetch(`${API_URL}/extraction/${documentId}`);
  if (!res.ok) throw new Error("Extraction not ready");
  return res.json();
}