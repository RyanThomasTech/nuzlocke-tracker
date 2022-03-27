/**
 * According to mocha docs, we need to export our hooks as a named export,
 * so for this file I'm disabling eslint's prefer-default-export
 */
/* eslint-disable import/prefer-default-export */
import {
  dropTables,
  createTables,
  insertIntoTables,
} from "../src/utils/queryFunctions";

export const mochaHooks = {
  beforeAll: [
    async function () {
      await createTables();
      await insertIntoTables();
    },
  ],

  afterAll: [
    async function () {
      await dropTables();
    },
  ],
};
