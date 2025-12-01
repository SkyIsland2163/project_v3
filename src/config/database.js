const { Sequelize } = require('sequelize');
require('./loadEnv');

const isTest = process.env.NODE_ENV === 'test';

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT) || 3306;
const dbName = process.env.DB_NAME || 'sample';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '1234';
const dbDialect = process.env.DB_DIALECT || 'mysql';

// Always hit a real database (dev/test/prod) using env-provided credentials.
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  logging: false,
  timezone: '+09:00',
  dialectOptions: {
    dateStrings: true,
    typeCast: true
  },
  pool: isTest
    ? { max: 5, min: 0, acquire: 30000, idle: 5000 }
    : { max: 10, min: 0, acquire: 30000, idle: 10000 }
});

module.exports = sequelize;
