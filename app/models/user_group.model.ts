import { GroupModel } from "./group.model";
import { UserModel } from "./user.model";
import { db } from './index'
import { Model, DataTypes } from 'sequelize';

export class UserGroupModel extends Model { }

UserGroupModel.init({
    userId: {
        type: DataTypes.STRING(5),
        references: {
            model: UserModel,
            key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
    },
    groupId: {
        type: DataTypes.STRING(5),
        references: {
            model: GroupModel,
            key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
    },
}, {
    sequelize: db,
    tableName: 'UserGroup',
    timestamps: false,
});

UserGroupModel.belongsTo(UserModel, { foreignKey: 'userId', targetKey: 'id', as: 'User' });
UserGroupModel.belongsTo(GroupModel, { foreignKey: 'groupId', targetKey: 'id', as: 'Group' });