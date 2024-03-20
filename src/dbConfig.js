const pg = require('pg')
const dotenv = require('dotenv')
dotenv.config({path:__dirname+'/.env'})

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

module.exports = pool