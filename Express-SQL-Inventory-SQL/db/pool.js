const { Pool } = require("pg");

// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
module.exports = new Pool({
    host: process.env.POOL_HOST, 
    user: process.env.POOL_USER,
    database: process.env.POOL_DB,
    password: process.env.POOL_PASS,
    port: 5432 // The default port
});