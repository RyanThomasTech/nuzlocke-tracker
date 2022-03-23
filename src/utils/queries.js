export const createTrainersTable = `
DROP TABLE IF EXISTS trainers;
CREATE TABLE IF NOT EXISTS trainers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(200) NOT NULL
  )
  `;

export const insertTrainers = `
INSERT INTO trainers(name)
VALUES ('Ryan'),
      ('Len')
`;

export const dropTrainersTable = "DROP TABLE trainers";
