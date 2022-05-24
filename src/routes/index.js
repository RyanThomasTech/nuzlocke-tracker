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
  updateCapdPokemon,
  createCapdPokemon,
  deleteCapdPokemon,
  createGame,
  readGame,
  gamesPage,
  updateGame,
  deleteGame,
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
router.put("/captured-pokemon/:id", updateCapdPokemon);
router.post("/captured-pokemon", createCapdPokemon);
router.delete("/captured-pokemon/:id", deleteCapdPokemon);
router.post("/games", createGame);
router.get("/games", gamesPage);
router.get("/games/:id", readGame);
router.put("/games/:id", updateGame);
router.delete("/games/:id", deleteGame);

export default router;
