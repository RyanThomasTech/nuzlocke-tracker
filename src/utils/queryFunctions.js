import db from "../db/database";
import {
  insertTrainers,
  dropTrainersTable,
  createTrainersTable,
} from "./queries";

/*
    this is a very clever execution of multiple queries that I stole from
    https://www.smashingmagazine.com/2020/04/express-api-backend-project-postgresql/
    and keep re-using. Note that this pattern is very production-unsafe due to
    waiitng to resolve the promise for the query to execute in a loop.
*/
export const executeQueryArray = async (arr) =>
  new Promise((resolve) => {
    const stop = arr.length;
    arr.forEach(async (q, index) => {
      await db.any(q);
      if (index + 1 === stop) resolve();
    });
  });

export const dropTables = () => executeQueryArray([dropTrainersTable]);
export const createTables = () => executeQueryArray([createTrainersTable]);
export const insertIntoTables = () => executeQueryArray([insertTrainers]);
