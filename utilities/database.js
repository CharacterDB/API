import mysql from 'mysql2/promise';

import config from '../config.js';

const options = {
    host: config.host,
    user: config.db_user,
    password: config.db_password,
    database: config.database,
    charset: config.charset,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}

async function connection() {
    const connection = await mysql.createConnection(options);

    await connection.query('SET collation_connection = utf8mb4_0900_ai_ci;');

    return connection;
}

async function getCharacter(character) {
    const conn = await connection();
    const keyword = (await conn.query('SELECT meaning FROM meaning WHERE character_id = ? AND keyword = 1', [character.id]))[0][0].meaning;
    const meaning = (await conn.query('SELECT meaning FROM meaning WHERE character_id = ? AND keyword = 0', [character.id]))[0].map((meaning) => (meaning.meaning));
    const composition = (await conn.query('SELECT primitive_id FROM composition WHERE character_id = ?', [character.id]))[0].map((primitive) => (primitive.primitive_id));
    return { ...character, keyword, meaning, composition };
}

export default connection;
export { getCharacter };