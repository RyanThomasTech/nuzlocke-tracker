import db from "../db/database";

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
    return db.one(
      `
            INSERT INTO $1:name($2:name)
            VALUES ($2:csv)
            RETURNING *
        `,
      [table, obj]
    );
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

  async updateReturnRow(obj) {
    const { id, name } = obj;
    const data = { name };
    const { table } = this;
    return db.one(
      `
        UPDATE $1~
        SET $2~ = $2:csv
        WHERE (id = $3)
        RETURNING *
      `,
      [table, data, id]
    );
  }
}

export default Model;
