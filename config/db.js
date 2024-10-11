/*
Set up a connection pool to a PostgreSQL database using the pg library and configuration settings stored in .env file (not provided). 
The connection pool is then exported for use in src/userModel.js and src/jobModel.js 
*/
const { Pool } = require('pg');
require('dotenv').config()

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;