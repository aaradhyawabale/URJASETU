const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<{ data: T | null; isFallback: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    return { data: json.data, isFallback: false };
  } catch (err: any) {
    console.warn(`[UrjaSetu API Client] Backend request to ${endpoint} failed. Using frontend demo fallback.`, err);
    return { data: null, isFallback: true, error: err.message };
  }
}
