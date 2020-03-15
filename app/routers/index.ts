import Joi from '@hapi/joi';
import { PermissionEnum } from '../types';

const userId = Joi.string().required();
const groupId = Joi.string().required();

export const userSchema = Joi.object({
    id: userId,
    login: Joi.string().required(),
    password: Joi.string().alphanum().required(),
    age: Joi.number().integer().min(4).max(130).required(),
    isDeleted: Joi.boolean().required(),
});

export const groupSchema = Joi.object({
    id: groupId,
    name: Joi.string().required(),
    permissions: Joi.array().required().items(
        Joi.string().valid(PermissionEnum.READ, PermissionEnum.WRITE, PermissionEnum.DELETE, PermissionEnum.SHARE, PermissionEnum.UPLOAD_FILES)),
});

export const userGroupSchema = Joi.object({
    userIds: Joi.array().required().items(userId),
    groupId: groupId,
});

export const loginSchema = Joi.object({
    username: Joi.string().alphanum().required(),
    password: Joi.string().alphanum().required(),
});


// error mapping.
export function errorResponse(schemaErrors) {
    const errors = schemaErrors.map((error: Joi.ErrorReport) => {
        return { path: error.path, message: error.message };
    });
    return {
        status: 'failed',
        errors,
    }
}

// Middleware validation
export function validateSchema(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false,
        });

        if (error && error.isJoi) {
            res.status(400).json(errorResponse(error.details));
        } else {
            next();
        }
    }
}