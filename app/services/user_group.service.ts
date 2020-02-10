import { UserGroupModel } from '../models';
import { Op } from 'sequelize';
import { db } from '../models/index';

export class UserGroupService {
    constructor() { }

    public async addUsersToGroup(userIds: string[], groupId: string): Promise<Boolean> {
        try {

            await db.transaction(async (t) => {
                for (const userId of userIds) {
                    UserGroupModel.create({ userId, groupId }, { transaction: t });
                }
            });
            return true;
        } catch (error) {
            console.error(`Error adding users: ${userIds} to group: ${groupId} -> Error: ${error}`);
            return false;
        }
    }
}
