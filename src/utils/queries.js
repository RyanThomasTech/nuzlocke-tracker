export const createTrainersTable = `
DROP TABLE IF EXISTS trainers;
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
  owner_id INTEGER NOT NULL,
  game_id INTEGER NOT NULL
)`;

export const createCapturedPokemonView = `
DROP VIEW IF EXISTS captured_pokemon_v;
CREATE OR REPLACE VIEW captured_pokemon_v AS
SELECT
  pkmn.id,
  COALESCE(nickname, name) AS nickname,
  is_alive,
  owner_id,
  species_id,
  game_id
FROM captured_pokemon capd
INNER JOIN pokemon pkmn ON pkmn.id = capd.id
`;

export const insertTrainers = `
INSERT INTO trainers(name)
VALUES ('Ryan'),
      ('Len')
`;

export const insertCapturedPokemon = `
INSERT INTO captured_pokemon(nickname,is_alive,owner_id,species_id,game_id)
VALUES ('Lotadio',FALSE,1,271,1),
      ('ChloroPhil',FALSE,2,3,1)
`;

export const dropTrainersTable = "DROP TABLE trainers";
export const dropCapturedPokemonTable = "DROP TABLE captured_pokemon CASCADE";
