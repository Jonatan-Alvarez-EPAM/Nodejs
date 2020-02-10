import { Permission } from './permissions.type';

export type Group = {
    id: string;
    name: string;
    permissions: Array<Permission>;
};