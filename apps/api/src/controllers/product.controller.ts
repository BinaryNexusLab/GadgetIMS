import { Request, Response } from "express";
import db from "../config/db";

export const getProducts = (_: Request, res: Response) => {
  db.query("SELECT * FROM products ORDER BY name ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getProductById = (req: Request, res: Response) => {
  const { id } = req.params;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results: any) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: "Product not found" });
    res.json(results[0]);
  });
};

export const createProduct = (req: Request, res: Response) => {
  const { name, sku, category, unit_price, stock, reorder_level } = req.body;

  if (!name || !sku || !unit_price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query(
    "INSERT INTO products (name, sku, category, unit_price, stock, reorder_level) VALUES (?, ?, ?, ?, ?, ?)",
    [name, sku, category, unit_price, stock || 0, reorder_level || 10],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Product created successfully" });
    }
  );
};

export const updateProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, sku, category, unit_price, stock, reorder_level } = req.body;

  db.query(
    "UPDATE products SET name = ?, sku = ?, category = ?, unit_price = ?, stock = ?, reorder_level = ? WHERE id = ?",
    [name, sku, category, unit_price, stock, reorder_level, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Product updated successfully" });
    }
  );
};

export const deleteProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product deleted successfully" });
  });
};
