import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes";
import salesRoutes from "./routes/sales.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

export default app;
