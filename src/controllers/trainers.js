import Model from "../models/model";

const trainersModel = new Model("trainers");

export const trainersPage = async (req, res) => {
  try {
    const data = await trainersModel.selectAll();
    res.status(200).json({ trainers: data });
  } catch (err) {
    res.status(200).json({ trainers: err.stack });
  }
};

export const createTrainer = async (req, res) => {
  try {
    const payload = { name: req.body.name };
    const data = await trainersModel.insertReturnRow(payload);
    res.status(200).json({ trainers: data });
  } catch (err) {
    res.status(200).json({ trainers: err.stack });
  }
};

export const readTrainer = async (req, res) => {
  try {
    const payload = { id: req.params.id };
    const data = await trainersModel.selectRow(payload);
    res.status(200).json({ trainers: data });
  } catch (err) {
    res.status(404).json({ trainers: err.stack });
  }
};

export const deleteTrainer = async (req, res) => {
  try {
    const payload = { id: req.params.id };
    const data = await trainersModel.deleteReturnRow(payload);
    res.status(200).json({ trainers: data });
    console.log(data);
  } catch (err) {
    res.status(404).json({ trainers: err.stack });
  }
};

export const updateTrainer = async (req, res) => {
  try {
    const { id, name } = req.body;
    const payload = { id, name };
    const data = await trainersModel.updateTrainerReturnRow(payload);
    res.status(200).json({ trainers: data });
    console.log(data);
  } catch (err) {
    try {
      const payload = { name: req.body.name };
      const data = await trainersModel.insertReturnRow(payload);
      res.status(201).json({ trainers: data });
    } catch (err2) {
      res.status(404).json({ trainers: err2.stack });
    }
  }
};
