import GamesModel from "../models/gamesModel";
import Model from "../models/model";

const gamesModel = new GamesModel();
const trainersModel = new Model("trainers");

export const gamesPage = async (req, res) => {
  try {
    const data = await gamesModel.readAllGamesWithTrainers();
    res.status(200).json({ games: data });
  } catch (err) {
    res.status(404).json({ games: err });
  }
};

export const createGame = async (req, res) => {
  try {
    const { trainers, name } = req.body;
    const payload = { trainers, name };
    // check that valid trainers are passed
    const trainersValid = await trainersModel.countMatchingIds(trainers);
    if (parseInt(trainersValid.count, 10) !== trainers.length) {
      throw new Error("Invalid trainers in game object");
    }
    // create game in games table
    // insert rows for players into games_trainers
    const data = await gamesModel.createGame(payload);
    res.status(200).json({ games: data });
  } catch (err) {
    res.status(500).json({ games: err });
  }
};

export const readGame = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { id };
    const data = await gamesModel.readSingleGameWithTrainers(payload);
    res.status(200).json({ games: data });
  } catch (err) {
    res.status(404).json({ games: err });
  }
};

export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const payload = { id, name };
    const data = await gamesModel.updateGame(payload);
    res.status(201).json({ games: data });
  } catch (err) {
    res.status(501).json({ games: err });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { id };
    const data = await gamesModel.deleteGame(payload);
    res.status(200).json({ games: data });
  } catch (err) {
    res.status(404).json({ games: err });
  }
};
