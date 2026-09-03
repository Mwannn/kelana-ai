const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface Message {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  conversation_id?: number;
  title: string;
  created_at: string;
  messages?: Message[];
}

function getAuthHeaders(): HeadersInit {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
  }
  return {
    'Content-Type': 'application/json',
  };
}

/**
 * Fetch all conversations for the authenticated user
 */
export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch(`${API_URL}/conversations`, {
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store'
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Sesi telah berakhir. Silakan login kembali.');
    }
    throw new Error('Gagal memuat riwayat percakapan');
  }
  return res.json();
}

/**
 * Fetch conversation details including message history
 */
export async function getConversation(id: number): Promise<Conversation> {
  const res = await fetch(`${API_URL}/conversations/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('Gagal memuat pesan percakapan');
  }
  return res.json();
}

/**
 * Create a new conversation
 */
export async function createConversation(title?: string): Promise<Conversation> {
  const res = await fetch(`${API_URL}/conversations`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title: title || 'Percakapan Baru' })
  });
  if (!res.ok) {
    throw new Error('Gagal membuat percakapan baru');
  }
  return res.json();
}

/**
 * Send a message within a conversation (multi-turn Bedrock orchestration)
 */
export async function sendMessage(conversationId: number, content: string): Promise<Message> {
  const res = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Gagal mengirim pesan');
  }
  return res.json();
}

/**
 * Rename a conversation (Session 10 Challenge Bonus)
 */
export async function renameConversation(conversationId: number, title: string): Promise<Conversation> {
  const res = await fetch(`${API_URL}/conversations/${conversationId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title })
  });
  if (!res.ok) {
    throw new Error('Gagal mengubah judul percakapan');
  }
  return res.json();
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId: number): Promise<void> {
  const res = await fetch(`${API_URL}/conversations/${conversationId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error('Gagal menghapus percakapan');
  }
}
