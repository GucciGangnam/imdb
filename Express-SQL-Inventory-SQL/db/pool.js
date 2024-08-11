const { Pool } = require('pg');

// HOSTED DB ENV FILES
module.exports = new Pool({
    host: process.env.POOL_HOST,
    port: process.env.POOL_PORT,
    database: process.env.POOL_DB,
    user: process.env.POOL_USER,
    password: process.env.POOL_PASS,
    ssl: {
        rejectUnauthorized: false // Adjust this based on your SSL requirements
    }
});






// LOCAL DB ENV FILES

// const { Pool } = require("pg");

// // All of the following properties should be read from environment variables
// // We're hardcoding them here for simplicity
// module.exports = new Pool({
//     host: process.env.POOL_HOST, 
//     user: process.env.POOL_USER,
//     database: process.env.POOL_DB,
//     password: process.env.POOL_PASS,
//     port: 5432 // The default port
// });