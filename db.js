const pgp = require('pg-promise')();
 
const db = pgp({
    host:       'localhost',
    port:       5432,
    database:   'english',
    user:       'postgres',
    password:   '12345'
});
 

module.exports = db;
