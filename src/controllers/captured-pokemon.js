import Model from "../models/model";

const capdCommandModel = new Model("captured_pokemon");
const capdQueryModel = new Model("captured_pokemon_v");

export const capdPage = async (req, res) => {
  try {
    const data = await capdQueryModel.selectAll();
    res.status(200).json({ captured_pokemon: data });
  } catch (err) {
    res.status(404).json({ captured_pokemon: err.stack });
  }
};

export const readCapdPokemon = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await capdQueryModel.selectRow({ id });
    res.status(200).json({ captured_pokemon: data });
  } catch (err) {
    res.status(404).json({ captured_pokemon: err.stack });
  }
};

export const updateCapdPokemon = async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id, 10) !== req.body.id) {
      throw new Error(
        `Creation/alteration of another ID is not permitted from this page. ${id} !== ${req.body.id}`
      );
    }
    const payload = req.body;
    const data = await capdCommandModel.updateCapdPokemonReturnRow(payload);
    res.status(201).json({ captured_pokemon: data });
  } catch (err) {
    res.status(501).json({ captured_pokemon: err.stack });
  }
};

export const createCapdPokemon = async (req, res) => {
  try {
    const payload = req.body;
    const data = await capdCommandModel.insertReturnRow(payload);
    res.status(200).json({ captured_pokemon: data });
  } catch (err) {
    res.status(400).json({ captured_pokemon: err.stack });
  }
};

export const deleteCapdPokemon = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { id };
    const data = await capdCommandModel.deleteReturnRow(payload);
    res.status(200).json({ captured_pokemon: data });
  } catch (err) {
    res.status(404).json({ captured_pokemon: err.stack });
  }
};
