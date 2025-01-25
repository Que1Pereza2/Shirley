// Import Sequelize so the aplication can connect to the database and read or 
// modify it.
import { Sequelize } from "sequelize";

// Database server User login.
const DB_USER = 'DB_User';
// Database server Password login.
const DB_PASSWORD = 'DB_Password';
// Database server Host login.
const DB_HOST = 'DB_Host';
// Database Dialect login.
const DB_DIALECT = 'mysql';
// Database Database login.
const DB_DATABASE = 'Shirley';

// Connect to the server in order to check if the database already exists.
const server = new Sequelize('', DB_USER, DB_PASSWORD, {
    host: DB_HOST
    ,dialect: DB_DIALECT
});

await server.query(`CREATE DATABASE IF NOT EXISTS \`${DB_DATABASE}\`;`);

// Closes the controller after checking.
server.close();

// Connects to the database.
const db = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD,{
     host: DB_HOST
    ,dialect: DB_DIALECT
});

// Exports the database connection so it can be used in other classes.
export default db;