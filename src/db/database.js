import pgpromise from "pg-promise";
import monitor from "pg-monitor";
import { DB_USER, DB_PASSWORD, DB_PORT } from "../settings";

// pgp and pgm need to have options passed to them, even if blank, otherwise they throw errors
const initOptions = {
  capSQL: true,
};
const pgp = pgpromise(initOptions);
const conn = `postgres://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/nuzlocke`;
const db = pgp(conn);
monitor.attach(initOptions);

export default db;
