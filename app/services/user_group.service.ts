import { UserGroupModel, UserModel } from '../models';
import { db } from '../models/index';

export class UserGroupService {
    constructor() { }

    public async addUsersToGroup(userIds: string[], groupId: string): Promise<boolean> {

        try {
            await db.transaction(async (t) => {
                for (const userId of userIds) {
                    await UserGroupModel.findOrCreate(
                        {
                            where: {
                                userId: userId,
                                groupId: groupId,
                            },
                            transaction: t,
                        });
                }
            });
            return true;
        } catch (error) {
            console.error(`Error adding users: ${userIds} to group: ${groupId} -> Error: ${error}`);
            return false;
        }
    }
}
