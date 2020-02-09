const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(
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

export class UserModel extends Model { }

UserModel.init({
    id: {
        type: DataTypes.STRING(5),
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    login: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 4 }
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    tableName: 'Users',
    timestamps: false,
});

(async () => {
    await UserModel.sync();
})();

// Update all models.
// (async () => {
//     await sequelize.sync({ force: true });
// })();