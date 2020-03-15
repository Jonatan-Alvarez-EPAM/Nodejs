import { UserModel } from '../models';
import { User } from '@app/types';
import { Op } from 'sequelize';

export class UserService {
    constructor() { }

    public async authenticate(login: string, password: string): Promise<User> {
        try {
            const user = await UserModel.findOne({ where: { login, password } });
            return user;
        } catch (error) {
            console.error('User not found.');
        }
    }

    public async getUserById(id: string): Promise<User> {
        try {
            const user = await UserModel.findOne({ where: { id } });
            return user;
        } catch (error) {
            console.error(`Error getting user with ID: '${id}' -> Error: ${error} `);
        }
    }

    public async createUser(user: User): Promise<User> {
        try {
            const newUser = await UserModel.create(user);
            return newUser;
        } catch (error) {
            console.error(`Error creating user with params: ${user} -> Error: ${error}`);
        }
    }

    public async updateUser(user: User): Promise<User> {
        try {
            const updatedUser = await UserModel.update(user, {
                where: {
                    id: user.id
                }
            });
            return updatedUser;
        } catch (error) {
            console.error(`Error updating user with params: ${user} -> Error: ${error}`);
        }
    }

    public async deleteUser(id: string): Promise<User> {
        try {
            const deletedUser = await UserModel.update({ isDeleted: true }, {
                where: { id }
            });
            return deletedUser;
        } catch (error) {
            console.error(`Error deleting user with ID: '${id}' -> Error: ${error}`);
        }
    }

    public async listUsers(loginSubstring: string, limit = 5): Promise<User[]> {
        try {
            const users: User[] = await UserModel.findAll({
                where: {
                    login: { [Op.iLike]: `%${loginSubstring}%` }
                },
                limit
            });
            return users;
        } catch (error) {
            console.error(`Error retrieving list of users with criteria: loginContains: '${loginSubstring}', limit: '${limit}' -> Error: ${error}`);
        }
    }
}
