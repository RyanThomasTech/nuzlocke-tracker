import express from "express";
import {
  indexPage,
  trainersPage,
  createTrainer,
  deleteTrainer,
  updateTrainer,
} from "../controllers";

const router = express.Router();

/* GET home page. */
router.get("/", indexPage);
router.get("/trainers", trainersPage);
router.post("/trainers", createTrainer);
router.delete("/trainers", deleteTrainer);
router.put("/trainers", updateTrainer);

export default router;
