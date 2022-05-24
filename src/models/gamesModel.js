import pgPromise from "pg-promise";
import Model from "./model";
import db from "../db/database";

const pgp = pgPromise({
  capSQL: true,
});

const gamesCols = new pgp.helpers.ColumnSet(["?id", "name"]);

class GamesModel extends Model {
  constructor() {
    super("games");
  }

  async readAllGamesWithTrainers() {
    const { table } = this;
    return db.any(
      `
      SELECT g.id, g.name, ARRAY_AGG(trainer_id) trainers
      FROM $1:name g
      INNER JOIN games_trainers gt ON g.id = gt.game_id
      INNER JOIN trainers t ON gt.trainer_id = t.id
      GROUP BY g.id
    `,
      [table]
    );
  }

  async readSingleGameWithTrainers(obj) {
    const { id } = obj;
    const { table } = this;
    return db.one(
      `
      SELECT g.id, g.name, ARRAY_AGG(trainer_id) trainers
      FROM $2:name g
      INNER JOIN games_trainers gt ON g.id = gt.game_id
      INNER JOIN trainers t ON gt.trainer_id = t.id
      WHERE g.id=$1:csv
      GROUP BY g.id
    `,
      [id, table]
    );
  }

  async createGame(obj) {
    const { trainers } = obj;
    const { table } = this;
    const condition = "RETURNING *";
    return db.tx("add game", async (t) => {
      // insert game into games table, return id
      const gameObj = await t.one(
        pgp.helpers.insert([obj], ["name"], table) + condition
      );
      if (gameObj) {
        // game successfully inserted, insert trainers into games_trainers table with new game id
        const gamesTrainersData = trainers.map((el) => ({
          trainer_id: el,
          game_id: gameObj.id,
        }));
        await t.none(
          pgp.helpers.insert(
            gamesTrainersData,
            ["game_id", "trainer_id"],
            "games_trainers"
          )
        );
        // return the object containing the id of the created game in games table
        return gameObj;
      }
      return []; // failed to add game
    });
  }

  async updateGame(obj) {
    const { table } = this;
    const condition = pgp.as.format(" WHERE id = $/id/ RETURNING *", obj);

    return db.one(pgp.helpers.update(obj, gamesCols, table) + condition);
  }

  async deleteGame(obj) {
    const { id } = obj;
    const { table } = this;
    return db.tx("delete game", async (t) => {
      const gamesRowDeleted = await t.one(
        `
        DELETE FROM $1:name
        WHERE id=$2
        RETURNING *
      `,
        [table, id]
      );
      const gtRowsDeleted = await t.any(
        `
        DELETE FROM games_trainers
        WHERE game_id=$1
        RETURNING *
      `,
        [id]
      );
      return { gamesRowDeleted, gtRowsDeleted };
    });
  }
}

export default GamesModel;
