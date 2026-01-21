import { Request, Response } from "express";
import db from "../config/db";

export const getDailySales = (req: Request, res: Response) => {
  const { date } = req.query;

  let query = "SELECT * FROM daily_sales";
  const params: any[] = [];

  if (date) {
    query += " WHERE DATE(sale_date) = ?";
    params.push(date);
  }

  query += " ORDER BY sale_date DESC";

  db.query(query, params, (err, results: any) => {
    if (err) {
      console.error("Error fetching sales:", err);
      return res.status(500).json({ error: err.message });
    }

    // For each sale, fetch its items
    if (results.length === 0) {
      return res.json([]);
    }

    let saleFetched = 0;
    const salesWithItems = results.map((sale: any) => ({ ...sale, items: [] }));

    results.forEach((sale: any, index: number) => {
      db.query(
        "SELECT * FROM sale_items WHERE sale_id = ?",
        [sale.id],
        (err, items: any) => {
          if (!err && items) {
            salesWithItems[index].items = items;
          }
          saleFetched++;
          if (saleFetched === results.length) {
            res.json(salesWithItems);
          }
        }
      );
    });
  });
};

export const getSaleById = (req: Request, res: Response) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM daily_sales WHERE id = ?",
    [id],
    (err, sales: any) => {
      if (err) return res.status(500).json({ error: err.message });
      if (sales.length === 0)
        return res.status(404).json({ error: "Sale not found" });

      // Get sale items
      db.query(
        "SELECT * FROM sale_items WHERE sale_id = ?",
        [id],
        (err, items) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ ...sales[0], items });
        }
      );
    }
  );
};

export const createDailySale = (req: Request, res: Response) => {
  const { items, total_amount, sale_date } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Sale must have at least one item" });
  }

  // Insert daily sale
  db.query(
    "INSERT INTO daily_sales (sale_date, total_amount) VALUES (?, ?)",
    [sale_date || new Date().toISOString().split("T")[0], total_amount],
    (err, result: any) => {
      if (err) {
        console.error("Error inserting sale:", err);
        return res.status(500).json({ error: err.message });
      }

      const saleId = result.insertId;
      let insertedCount = 0;
      let errorSent = false;

      // Insert sale items
      items.forEach((item: any) => {
        db.query(
          "INSERT INTO sale_items (sale_id, product_id, model_name, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?, ?)",
          [
            saleId,
            item.product_id || null,
            item.modelName,
            item.quantity,
            item.unitPrice,
            item.total,
          ],
          (err) => {
            if (err) {
              console.error("Error inserting sale item:", err);
              if (!errorSent) {
                errorSent = true;
                return res.status(500).json({ error: err.message });
              }
              return;
            }
            insertedCount++;
            if (insertedCount === items.length && !errorSent) {
              res
                .status(201)
                .json({ message: "Sale created successfully", saleId });
            }
          }
        );
      });
    }
  );
};

export const updateDailySale = (req: Request, res: Response) => {
  const { id } = req.params;
  const { total_amount } = req.body;

  db.query(
    "UPDATE daily_sales SET total_amount = ? WHERE id = ?",
    [total_amount, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Sale updated successfully" });
    }
  );
};

export const deleteDailySale = (req: Request, res: Response) => {
  const { id } = req.params;

  db.query("DELETE FROM daily_sales WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Sale deleted successfully" });
  });
};
