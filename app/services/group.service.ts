import { GroupModel } from '../models';
import { Group } from '@app/types';

export class GroupService {
    constructor() { }

    public async getGroupById(id: string): Promise<Group> {
        try {
            const group = await GroupModel.findOne({ where: { id } });
            return group;
        } catch (error) {
            console.error(`Error getting group with ID: '${id}' -> Error: ${error} `);
        }
    }

    public async createGroup(group: Group): Promise<Group> {
        try {
            const newGroup = await GroupModel.create(group);
            return newGroup;
        } catch (error) {
            console.error(`Error creating group with params: ${group} -> Error: ${error}`);
        }
    }

    public async updateGroup(group: Group): Promise<Group> {
        try {
            const updatedGroup = await GroupModel.update(group, {
                where: {
                    id: group.id
                }
            });
            return updatedGroup;
        } catch (error) {
            console.error(`Error updating group with params: ${group} -> Error: ${error}`);
        }
    }

    public async deleteGroup(id: string): Promise<Group> {
        try {
            const deletedGroup = await GroupModel.destroy({
                where: { id }
            });
            return deletedGroup;
        } catch (error) {
            console.error(`Error deleting group with ID: '${id}' -> Error: ${error}`);
        }
    }

    public async listGroups(): Promise<Group[]> {
        try {
            const groups: Group[] = await GroupModel.findAll();
            return groups;
        } catch (error) {
            console.error(`Error retrieving list of groups -> Error: ${error}`);
        }
    }
}
