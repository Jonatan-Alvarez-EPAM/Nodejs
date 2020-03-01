// user.router.js - Group route module
import { UserService, UserGroupService } from '../services';
import { validateSchema, userSchema, userGroupSchema } from '.';
import { logError } from '../logger';
import express = require('express');

const router = express.Router();

// API

// Get user by id
router.param('id', (req, res, next) => {
    next();
});

router.get('/:id', (req, res, next) => {
    next();
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const userServiceInstance = new UserService();
    const user = await userServiceInstance.getUserById(id);

    if (!id) {
        logError(req.method, req.params, 'NO ID PROVIDED');
        res.status(404).json({
            message: `NO ID PROVIDED`,
        }).end();
    }

    if (!user) {
        logError(req.method, req.params, `USER WITH ID: '${id}'  NOT FOUND :(`);
        res.status(404).json({
            message: `USER WITH ID: '${id}'  NOT FOUND :(`,
        });
    } else {
        res.json(user);
    }
    res.end();
});

// Create user.
router.post('/', (req, res, next) => {
    next();
});

router.post('/', validateSchema(userSchema), async (req, res) => {
    const keysLength = Object.keys(req.body).length;
    if (keysLength === 0) {
        logError(req.method, JSON.stringify(req.body), `Not payload found!`);
        res.status(400).json({
            message: `Not payload found!`,
        }).end();
    }
    if (keysLength < 5) {
        logError(req.method, JSON.stringify(req.body), `Missing fields!`);
        res.status(400).json({
            message: `Missing fields!`,
        }).end();
    }

    const { id, login, password, age, isDeleted } = req.body;
    const userServiceInstance = new UserService();
    const user = await userServiceInstance.getUserById(id);

    const isIdAlreadyUsed = !!user;
    if (isIdAlreadyUsed) {
        logError(req.method, JSON.stringify(req.body), `ID: '${id}' is already used`);
        res.status(404).json({
            message: `ID: '${id}' is already used`,
        });
    } else {
        const newUser = await userServiceInstance.createUser({ id, login, password, age, isDeleted });
        if (!newUser) {
            logError(req.method, JSON.stringify(req.body), `Error creating new user with info ${newUser}`);
            res.status(404).json({
                message: `Error creating new user with info ${newUser}`,
            });
        } else {
            res.status(200);
        }
    }
    res.end();
});

// Update user
router.put('/', (req, res, next) => {
    next();
});

router.put('/', validateSchema(userSchema), async (req, res) => {
    const userInfo = req.body;
    const id = userInfo.id;
    const userServiceInstance = new UserService();
    const user = await userServiceInstance.getUserById(id);

    if (!user) {
        logError(req.method, JSON.stringify(req.body), `USER WITH ID: '${id}'  NOT FOUND :(`);
        res.status(404).json({
            message: `USER WITH ID: '${id}'  NOT FOUND :(`,
        });
    } else {
        const updatedUser = await userServiceInstance.updateUser(userInfo);
        if (!updatedUser) {
            logError(req.method, JSON.stringify(req.body), `Error updating info ${userInfo} for user with ID: '${id}'`);
            res.status(404).json({
                message: `Error updating info ${userInfo} for user with ID: '${id}'`,
            });
        }
        else {
            res.status(200);
        }
    }
    res.end();
});

// List users
router.get('/AutoSuggestUsers', (req, res, next) => {
    next();
});

router.get('/AutoSuggestUsers', async (req, res) => {
    const { loginSubstring, limit } = req.query;
    const userServiceInstance = new UserService();
    const suggestions = await userServiceInstance.listUsers(loginSubstring, limit);

    res.status(200).json({
        results: suggestions,
    }).end();
});

// Delete user
router.delete('/', (req, res, next) => {
    next();
});

router.delete('/', async (req, res) => {
    const { id } = req.query;
    const userServiceInstance = new UserService();
    const deletedUser = await userServiceInstance.deleteUser(id);
    if (!deletedUser) {
        logError(req.method, JSON.stringify(req.query), `Error deleting user with ID: '${id}'`);
        res.status(404).json({
            message: `Error deleting user with ID: '${id}'`,
        });
    }
    else {
        res.status(200);
    }
    res.end();
});

// Add users to group.
router.post('/addUsersToGroup', (req, res, next) => {
    next();
});

router.post('/addUsersToGroup', validateSchema(userGroupSchema), async (req, res) => {
    const keysLength = Object.keys(req.body).length;
    if (keysLength === 0) {
        logError(req.method, JSON.stringify(req.body), `Not payload found!`);
        res.status(400).json({
            message: `Not payload found!`,
        }).end();
    }
    if (keysLength < 2) {
        logError(req.method, JSON.stringify(req.body), `Missing fields!`);
        res.status(400).json({
            message: `Missing fields!`,
        }).end();
    }

    const { groupId, userIds } = req.body;
    const userGroupServiceInstance = new UserGroupService();
    const result = await userGroupServiceInstance.addUsersToGroup(userIds, groupId);
    console.log("RESULT:", result);
    if (!result) {
        logError(req.method, JSON.stringify(req.body), `Error adding users: ${userIds} to group: ${groupId}`);
        res.status(404).json({
            message: `Error adding users: ${userIds} to group: ${groupId}`,
        });
    } else {
        res.status(200);
    }
    res.end();
});

module.exports = router;