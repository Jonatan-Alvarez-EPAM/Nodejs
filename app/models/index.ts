const { Sequelize } = require('sequelize');
require('dotenv').config();

const DATABASE_URL = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DEV_DATABASE_URL;
export const db = new Sequelize(
    DATABASE_URL,
    {
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

(async () => {
    await db.sync();
})();


export * from './user.model';
export * from './group.model';
export * from './user_group.model';