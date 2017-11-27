var mysql = require('mysql');
require('dotenv').config();

var pool = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PW,
  database        : process.env.DB_USER
});

module.exports.pool = pool;
