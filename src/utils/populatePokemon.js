import axios from "axios";
import fs from "fs";
import db from "../db/database";
import pokeList from "./pokemonList";

const MAX_POKEMON = 898;
const createPokemonTable = `
    DROP TABLE IF EXISTS pokemon;
    CREATE TABLE IF NOT EXISTS pokemon(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(40) NOT NULL
        )
`;

/* evidently, fetch will not be introduced into Node for another year or two
const fetchInit = {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit'
}

const fetchPokemon = async () => {
    const pokemon = await fetch('https://pokeapi.co/api/v2/pokemon?limit=898', init)
        .then((res) => res.json())
        .then(data => {
            data.map((el) => (el.name))
        }); */
const fetchPokemon = async () => {
  // attempt to get an updated list of 'mon from pokeapi in case of game updates,
  // otherwise the list that ships with the app will suffice
  try {
    db.none(createPokemonTable);
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`
    );
    const pokemon = response.data.results.map((el) => el.name);
    fs.writeFile(
      "/home/ryan/express/nuzlocke-tracker/src/utils/pokemonList.js",
      `
        const pokeList = [${pokemon.map((el) => `'${el}'`)}]

        export default pokeList;
        `,
      (err) => {
        console.error(err);
      }
    );
    db.none(
      `
            INSERT INTO pokemon(name)
            SELECT unnest($1)
            `,
      [pokemon]
    );
  } catch (err) {
    console.error(err);
    const pokemon = pokeList;
    db.none(
      `
            INSERT INTO pokemon(name)
            SELECT unnest($1)
            `,
      [pokemon]
    );
  }
};

(async () => {
  await fetchPokemon();
})();
