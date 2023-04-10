
// imports
import express from 'express';
import conn, { getCharacter } from './utilities/database.js';

import asyncWrapper from './utilities/asyncWrapper.js';
import config from './config.js';

console.log(config.db_password);

// create app
const app = express();

app.use((req, res, next) => {
    req.time = new Date().toISOString();
    next();
});

app.get('/', asyncWrapper(async (req, res) => {
    const { pronunciation } = req.query;
    let characters;
    if (pronunciation === undefined) {
        characters = (await conn.execute('SELECT id, symbol, pronunciation, tone FROM characters LEFT JOIN pronunciation ON characters.id = pronunciation.character_id ORDER BY id'))[0];
    } else {
        characters = (await conn.execute('SELECT id, symbol, pronunciation, tone FROM characters LEFT JOIN pronunciation ON characters.id = pronunciation.character_id WHERE pronunciation LIKE ? ORDER BY id', [`%${pronunciation}%`]))[0];
    }
    let data = await Promise.all(characters.map((character) => getCharacter(character)));
    res.send(data);
}));

app.get('/:id(\\d+)/', asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const [[character]] = await conn.execute('SELECT id, symbol, pronunciation, tone FROM characters LEFT JOIN pronunciation ON characters.id = pronunciation.character_id WHERE id=?', [id]);
    const data = await getCharacter(character);
    res.send(data);
}));

app.get('/:symbol/', asyncWrapper(async (req, res) => {
    const { symbol } = req.params;
    const [[character]] = await conn.execute('SELECT id, symbol, pronunciation, tone FROM characters LEFT JOIN pronunciation ON characters.id = pronunciation.character_id WHERE symbol=?', [symbol]);
    const data = await getCharacter(character);
    res.send(data);
}));

app.use((req, res) => {
    res.status(404).send({ error: "invalid request" })
})

app.use((err, req, res, next) => {
    console.log("==============ERROR==============");
    console.log(`${req.time} ${req.method} ${req.url}`);
    console.log(err);
    console.log("=================================");
    res.status(500).send({ error: "internal server error" })
});

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});