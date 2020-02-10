import { PermissionEnum } from '../types'
import { db } from './index'
import { Model, DataTypes } from 'sequelize';

export class GroupModel extends Model { }

GroupModel.init({
    id: {
        type: DataTypes.STRING(5),
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.ENUM(PermissionEnum.READ, PermissionEnum.WRITE, PermissionEnum.DELETE, PermissionEnum.SHARE, PermissionEnum.UPLOAD_FILES)),
        allowNull: false,
    }
}, {
    sequelize: db,
    tableName: 'Groups',
    timestamps: false,
});