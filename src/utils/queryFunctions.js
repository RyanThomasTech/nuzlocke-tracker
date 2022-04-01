import db from "../db/database";
import {
  insertTrainers,
  insertCapturedPokemon,
  dropTrainersTable,
  dropCapturedPokemonTable,
  createTrainersTable,
  createCapturedPokemonTable,
  createCapturedPokemonView,
} from "./queries";

/*
    this is a very clever execution of multiple queries that I stole from
    https://www.smashingmagazine.com/2020/04/express-api-backend-project-postgresql/
    and keep re-using. Note that this pattern is very production-unsafe due to
    waiitng to resolve the promise for the query to execute in a loop.
*/
export const executeQueryArray = (arr) => {
  db.tx('setup', async (t) => {
    arr.forEach(async (ele) => {
      await t.none(ele);
    });
  })
  .then(()=> {
    // success
  })
  .catch(err => {
    console.error(err);
  })
}

export const dropTables = () =>
  executeQueryArray([dropTrainersTable, dropCapturedPokemonTable]);
export const createTables = () =>
  executeQueryArray([
    createTrainersTable,
    createCapturedPokemonTable,
    createCapturedPokemonView
  ]);
export const insertIntoTables = () =>
  executeQueryArray([insertTrainers, insertCapturedPokemon]);
