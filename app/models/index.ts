const { Sequelize } = require('sequelize');
export const db = new Sequelize(
    'postgres://postgres:Usuario1!&@localhost:5432/nodejs-course',
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