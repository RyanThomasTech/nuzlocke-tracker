// import pgpromise from "pg-promise";
import db from "../db/database";

/*const pgp = pgpromise({
    capSQL: true
})*/

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

  async updateTrainerReturnRow(obj) {
    const data = obj;
    const { table } = this;
   // const condition = pgp.as.format("WHERE id = $/id/", data);
    /* eslint-disable no-unused-expressions */
    //pgp.helpers.insert(data,["name"],table) + condition;
    /* eslint-enable no-unused-expressions */
  }
}

export default Model;
