const API_BASE = '/api/v1/books';

export async function fetchHealth() {
  try {
    const res = await fetch('/health');
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'unreachable', error: err.message };
  }
}

export async function getBooks(search = '', genre = '') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (genre) params.append('genre', genre);

  const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch books: ${res.statusText}`);
  return await res.json();
}

export async function createBook(bookData) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to create book: ${res.statusText}`);
  }
  return await res.json();
}

export async function updateBook(id, bookData) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to update book: ${res.statusText}`);
  }
  return await res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to delete book: ${res.statusText}`);
  }
  return await res.json();
}
