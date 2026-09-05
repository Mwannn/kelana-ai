/**
 * Central API configuration for KelanaAI frontend.
 * Automatically normalizes NEXT_PUBLIC_API_URL so it correctly appends /api/v1
 * regardless of whether the environment variable is set as:
 * - 'https://kelana-ai-api.onrender.com'
 * - 'https://kelana-ai-api.onrender.com/'
 * - 'https://kelana-ai-api.onrender.com/api/v1'
 * - or left empty (defaults to http://localhost:8000/api/v1)
 */
const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const cleanedUrl = rawUrl.replace(/\/+$/, '');

export const API_URL = cleanedUrl.endsWith('/api/v1')
  ? cleanedUrl
  : `${cleanedUrl}/api/v1`;

export function getAuthHeaders(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
      };
    }
  }
  return {};
}
