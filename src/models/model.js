import pgpromise from "pg-promise";
import db from "../db/database";

const pgp = pgpromise({
  capSQL: true,
});

const csId = new pgp.helpers.Column(
  "?id" // ? before indicates cnd=true
);

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
}

export default Model;
