import pgpromise from "pg-promise";
import db from "../db/database";

const pgp = pgpromise({
  capSQL: true,
});

const csCapdPokemon = new pgp.helpers.ColumnSet([
  { name: "nickname", skip: (c) => !c.exists },
  { name: "is_alive", skip: (c) => !c.exists },
  { name: "species_id", skip: (c) => !c.exists },
  { name: "owner_id", skip: (c) => !c.exists },
  { name: "game_id", skip: (c) => !c.exists },
]);

const csTrainers = new pgp.helpers.ColumnSet(["name"]);

class Model {
  constructor(table) {
    this.table = table;
  }

  async selectAll() {
    const { table } = this;
    return db.any("SELECT * FROM $1:name", [table]);
  }

  async selectRow(obj) {
    const { table } = this;
    return db.one(
      `
        SELECT * FROM $1:name
        WHERE ($2:name = $2:csv)
        `,
      [table, obj]
    );
  }

  async countMatchingIds(arr) {
    const { table } = this;
    return db.one(
      `
        SELECT COUNT(*)
        FROM $1~
        WHERE id
        IN ($2:csv)
      `,
      [table, arr]
    );
  }

  async insertReturnRow(obj) {
    const { table } = this;
    let columns;
    switch (table) {
      case "captured_pokemon":
        columns = csCapdPokemon;
        break;
      case "trainers":
        columns = csTrainers;
        break;
      default:
        throw new Error("No ColumnSet for table");
    }
    const condition = " RETURNING *";
    return db.one(pgp.helpers.insert(obj, columns, table) + condition);
  }

  async deleteReturnRow(obj) {
    const { table } = this;
    return db.one(
      `
        DELETE FROM $1:name
        WHERE ($2:name=$2:csv)
        RETURNING *
        `,
      [table, obj]
    );
  }

  async updateTrainerReturnRow(obj) {
    const data = obj;
    const { table } = this;
    const condition = pgp.as.format(` WHERE id = $/id/ RETURNING *`, data);
    return db.one(pgp.helpers.update(data, ["name"], table) + condition);
  }

  async updateCapdPokemonReturnRow(obj) {
    const data = obj;
    const { table } = this;
    const condition = pgp.as.format(` WHERE id = $/id/ RETURNING *`, data);
    return db.one(pgp.helpers.update(data, csCapdPokemon, table) + condition);
  }

  async updateGamesReturnRow(obj) {
    const data = obj;
    const { table } = this;
    const condition = pgp.as.format(` WHERE id = $/id/ RETURNING *`, data);
    return db.one(pgp.helpers.update(data, ["name"], table) + condition);
  }
}

export default Model;
