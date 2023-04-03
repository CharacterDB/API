import mysql from 'mysql2/promise';

import config from '../config.js';

const sql = 'SET collation_connection = utf8mb4_0900_ai_ci';

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
    const keyword = (await connection.query('SELECT meaning FROM meaning WHERE character_id = ? AND keyword = 1', [character.id]))[0][0].meaning;
    const meaning = (await connection.query('SELECT meaning FROM meaning WHERE character_id = ? AND keyword = 0', [character.id]))[0].map((meaning) => (meaning.meaning));
    const composition = (await connection.query('SELECT primitive_id FROM composition WHERE character_id = ?', [character.id]))[0].map((primitive) => (primitive.primitive_id));
    return { ...character, keyword, meaning, composition };
}

export default connection;
export { getCharacter };