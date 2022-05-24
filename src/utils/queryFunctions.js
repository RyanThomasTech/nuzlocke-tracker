import db from "../db/database";
import {
  insertTrainers,
  insertCapturedPokemon,
  insertGames,
  insertGamesTrainers,
  dropTrainersTable,
  dropCapturedPokemonTable,
  dropGamesTable,
  dropGamesTrainersTable,
  createTrainersTable,
  createCapturedPokemonTable,
  createCapturedPokemonView,
  createGamesTable,
  createGamesTrainersTable,
} from "./queries";

/*
  I am certain I'll look back on this code in a few years and wince.
  Async + callback hell just so that I can load arrays with
  queries and execute them in a reliably synchronous manner.
*/
export const executeQueryArray = async (arr) => {
  await db
    .tx(`executeQueryArray`, async (t) => {
      arr.forEach((ele) => {
        t.none(ele);
      });
    })
    .then(() => {
      // success
    })
    .catch((err) => {
      console.error(err);
    });
};

export const dropTables = () =>
  executeQueryArray([
    dropTrainersTable,
    dropGamesTable,
    dropGamesTrainersTable,
    dropCapturedPokemonTable,
  ]);
export const createTables = () =>
  executeQueryArray([
    createTrainersTable,
    createGamesTable,
    createGamesTrainersTable,
    createCapturedPokemonTable,
    createCapturedPokemonView,
  ]);
export const insertIntoTables = () =>
  executeQueryArray([
    insertTrainers,
    insertGames,
    insertGamesTrainers,
    insertCapturedPokemon,
  ]);
