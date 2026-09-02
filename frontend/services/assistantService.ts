const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface AssistantResponse {
  question: string;
  answer: string;
  source?: string | null;
  sources?: string[];
  citations?: any[];
}

export async function askAssistant(question: string): Promise<AssistantResponse> {
  const res = await fetch(`${API_URL}/assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ question })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Gagal mendapatkan jawaban dari Travel Assistant.");
  }

  return res.json();
}
