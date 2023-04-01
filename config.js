
const config = {
    db_host: 'localhost',
    db_user: 'chardb',
    db_password: process.env.CHARDB_PASSWORD || 'specify a strong password',
    database: 'chardb',
    db_charset: 'utf8mb4',
    port: 3001
}

export default config;