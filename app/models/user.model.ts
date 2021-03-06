
import { db } from './index'
import { Model, DataTypes } from 'sequelize';

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
    sequelize: db,
    tableName: 'Users',
    timestamps: false,
});