const API_URL = "https://web-production-569818.up.railway.app/api/v1";

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

export async function uploadDocument(file: File): Promise<Document> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function getDocuments(): Promise<Document[]> {
  const res = await fetch(`${API_URL}/documents/`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function getExtraction(documentId: string): Promise<Extraction> {
  const res = await fetch(`${API_URL}/extraction/${documentId}`);
  if (!res.ok) throw new Error("Extraction not ready");
  return res.json();
}