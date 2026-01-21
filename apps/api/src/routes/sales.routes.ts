import { Router } from "express";
import {
  getDailySales,
  getSaleById,
  createDailySale,
  updateDailySale,
  deleteDailySale,
} from "../controllers/sales.controller";

const router = Router();

router.get("/", getDailySales);
router.get("/:id", getSaleById);
router.post("/", createDailySale);
router.put("/:id", updateDailySale);
router.delete("/:id", deleteDailySale);

export default router;
