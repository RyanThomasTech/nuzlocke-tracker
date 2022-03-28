import axios from 'axios';
import db from "../db/database";

const createPokemonTable = `
    DROP TABLE IF EXISTS pokemon;
    CREATE TABLE IF NOT EXISTS pokemon(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(40) NOT NULL
        )
`;

/* evidently, fetch will not be introduced into Node for another year or two
const fetchInit = {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit'
}

const fetchPokemon = async () => {
    const pokemon = await fetch('https://pokeapi.co/api/v2/pokemon?limit=898', init)
        .then((res) => res.json())
        .then(data => {
            data.map((el) => (el.name))
        }); */
const fetchPokemon = async() => {
    db.none(createPokemonTable);
    try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=898');
        const pokemon = response.data.results.map((el) => (el.name));
        db.none(`
            INSERT INTO pokemon(name)
            SELECT unnest($1)
            `,[pokemon])
    } catch (err) {
        console.error(err);
    }
};

(async () => {
    await fetchPokemon();
})();