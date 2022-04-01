import express from "express";
import {
  indexPage,
  trainersPage,
  createTrainer,
  deleteTrainer,
  updateTrainer,
  readTrainer,
  capdPage,
  readCapdPokemon,
} from "../controllers";

const router = express.Router();

/* GET home page. */
router.get("/", indexPage);
router.get("/trainers", trainersPage);
router.get("/trainers/:id", readTrainer);
router.post("/trainers", createTrainer);
router.delete("/trainers/:id", deleteTrainer);
router.put("/trainers", updateTrainer);
router.get("/captured-pokemon", capdPage);
router.get("/captured-pokemon/:id", readCapdPokemon);

export default router;
