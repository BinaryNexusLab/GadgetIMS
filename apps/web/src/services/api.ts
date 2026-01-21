const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (res.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export function loginRequest(username: string, password: string) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function logoutRequest() {
  return apiFetch('/auth/logout', { method: 'POST' });
}

export function getCurrentUser() {
  return apiFetch('/auth/me');
}

// Products API
export async function getProducts() {
  return apiFetch('/products');
}

export async function getProductById(id: number) {
  return apiFetch(`/products/${id}`);
}

export async function createProduct(data: {
  name: string;
  sku: string;
  category: string;
  unit_price: number;
  stock: number;
  reorder_level: number;
}) {
  return apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(
  id: number,
  data: {
    name: string;
    sku: string;
    category: string;
    unit_price: number;
    stock: number;
    reorder_level: number;
  },
) {
  return apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number) {
  return apiFetch(`/products/${id}`, { method: 'DELETE' });
}

// Sales API
export async function getSales(date: string) {
  return apiFetch(`/sales?date=${date}`);
}

export async function getSaleById(id: number) {
  return apiFetch(`/sales/${id}`);
}

export async function createSale(payload: any) {
  return apiFetch('/sales', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateSale(id: number, payload: any) {
  return apiFetch(`/sales/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteSale(id: number) {
  return apiFetch(`/sales/${id}`, { method: 'DELETE' });
}
