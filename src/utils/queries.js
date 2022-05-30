export const createTrainersTable = `
DROP TABLE IF EXISTS trainers CASCADE;
CREATE TABLE IF NOT EXISTS trainers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(200) NOT NULL
  )
  `;

export const createCapturedPokemonTable = `
DROP TABLE IF EXISTS captured_pokemon CASCADE;
CREATE TABLE IF NOT EXISTS captured_pokemon (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nickname VARCHAR(20) DEFAULT NULL,
  is_alive BOOLEAN default TRUE,
  species_id INTEGER NOT NULL,
  game_trainer_id INTEGER NOT NULL,
  CONSTRAINT fk_species
    FOREIGN KEY(species_id)
      REFERENCES pokemon(id),
  CONSTRAINT fk_game_trainer
    FOREIGN KEY(game_trainer_id)
      REFERENCES games_trainers(id)
      ON DELETE CASCADE
)`;

export const createGamesTable = `
DROP TABLE IF EXISTS games CASCADE;
CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(60)
)`;

export const createGamesTrainersTable = `
DROP TABLE IF EXISTS games_trainers CASCADE;
CREATE TABLE IF NOT EXISTS games_trainers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  game_id INTEGER NOT NULL,
  trainer_id INTEGER NOT NULL,
  CONSTRAINT fk_game
    FOREIGN KEY(game_id)
      REFERENCES games(id)
      ON DELETE CASCADE,
  CONSTRAINT fk_trainer
    FOREIGN KEY(trainer_id)
      REFERENCES trainers(id)
      ON DELETE CASCADE
)`;

export const createCapturedPokemonView = `
DROP VIEW IF EXISTS captured_pokemon_v;
CREATE OR REPLACE VIEW captured_pokemon_v AS
SELECT
  pkmn.id,
  COALESCE(nickname, pkmn.name) AS nickname,
  is_alive,
  species_id,
  gt.game_id,
  t.id AS trainer_id,
  t.name AS trainer
FROM captured_pokemon capd
INNER JOIN pokemon pkmn ON pkmn.id = capd.id
INNER JOIN games_trainers gt ON gt.id = capd.game_trainer_id
INNER JOIN trainers t ON t.id = gt.trainer_id
`;

export const insertTrainers = `
INSERT INTO trainers(name)
VALUES ('Ryan'),('Len')
`;

export const insertCapturedPokemon = `
INSERT INTO captured_pokemon(nickname,is_alive,game_trainer_id,species_id)
VALUES ('Lotadio',FALSE,1,271),
      ('ChloroPhil',FALSE,2,3)
`;

export const insertGames = `
INSERT INTO games(name)
VALUES ('ORASTest'),('SecondGame')
`;

export const insertGamesTrainers = `
INSERT INTO games_trainers(game_id,trainer_id)
VALUES (1,1),(1,2)
`;

export const dropGamesTrainersTable = "DROP TABLE games_trainers CASCADE";
export const dropTrainersTable = "DROP TABLE trainers CASCADE";
export const dropCapturedPokemonTable = "DROP TABLE captured_pokemon CASCADE";
export const dropGamesTable = "DROP TABLE games CASCADE";
