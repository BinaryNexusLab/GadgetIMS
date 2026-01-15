const API = "http://localhost:5000/api";

export async function getProducts() {
  const res = await fetch(`${API}/products`);
  return res.json();
}

export async function addProduct(data: { name: string; unit_price: number }) {
  await fetch(`${API}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}
