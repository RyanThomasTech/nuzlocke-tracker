import Model from "../models/model";

const trainersModel = new Model("trainers");

const trainersPage = async (req, res) => {
  try {
    const data = await trainersModel.selectAll();
    res.status(200).json({ trainers: data });
  } catch (err) {
    res.status(200).json({ trainers: err.stack });
  }
};

export default trainersPage;
