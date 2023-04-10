import mysql from 'mysql2/promise';

import config from '../config.js';

const sql = 'SET collation_connection = utf8mb4_0900_ai_ci';

const tones = {
    a: ['a', 'ā', 'á', 'ǎ', 'à'],
    o: ['o', 'ō', 'ó', 'ǒ', 'ò'],
    e: ['e', 'ē', 'é', 'ě', 'è'],
    i: ['i', 'ī', 'í', 'ǐ', 'ì'],
    u: ['u', 'ū', 'ú', 'ǔ', 'ù'],
    ü: ['ü', 'ǖ', 'ǘ', 'ǚ', 'Ǜ']
};


const connection = await mysql.createConnection({
    host: config.host,
    user: config.db_user,
    password: config.db_password,
    database: config.database,
    charset: config.charset
});

await connection.execute(sql);
console.log('Charset configured.');


async function getCharacter(character) {
    console.log(character.id);
    const keyword = (await connection.query('SELECT meaning FROM meaning WHERE character_id = ? AND keyword = 1', [character.id]))[0][0].meaning;
    const meaning = (await connection.query('SELECT meaning FROM meaning WHERE character_id = ? AND keyword = 0', [character.id]))[0].map((meaning) => (meaning.meaning));
    const composition = (await connection.query('SELECT primitive_id FROM composition WHERE character_id = ?', [character.id]))[0].map((primitive) => (primitive.primitive_id));
    character = { ...character, keyword, meaning, composition };
    console.log(character);
    character.transcription = character.pronunciation;

    if (!character.tone) return character;

    if (character.transcription.includes('a')) character.transcription = character.transcription.replace('a', tones.a[character.tone]);
    else if (character.transcription.includes('o')) character.transcription = character.transcription.replace('o', tones.o[character.tone]);
    else if (character.transcription.includes('iu')) character.transcription = character.transcription.replace('u', tones.u[character.tone]);
    else if (character.transcription.includes('e')) character.transcription = character.transcription.replace('e', tones.e[character.tone]);
    else if (character.transcription.includes('i')) character.transcription = character.transcription.replace('i', tones.i[character.tone]);
    else if (character.transcription.includes('u')) character.transcription = character.transcription.replace('u', tones.u[character.tone]);
    else if (character.transcription.includes('ü')) character.transcription = character.transcription.replace('ü', tones['ü'][character.tone]);
    return character;
}

export default connection;
export { getCharacter };