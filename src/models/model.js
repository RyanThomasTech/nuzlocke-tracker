import db from "../db/database";

class Model {
  constructor(table) {
    this.table = table;
  }

  async selectAll() {
    const { table } = this;
    return db.any("SELECT * FROM $1:name", table);
  }
}

export default Model;
