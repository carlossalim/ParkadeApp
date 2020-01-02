
const Sequelize = require('sequelize');
// Option 1: Passing parameters separately
module.exports = new Sequelize('parkadedb', 'parkade_user', '!ckpvu3zr6quKj!', {
    host: 'localhost',
    dialect: 'mysql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})
