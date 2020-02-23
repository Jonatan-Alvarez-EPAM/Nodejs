// group.router.js - Group route module
import { GroupService } from '../services';
import { validateSchema, groupSchema } from '.';
import { logError } from '../logger';
import express = require('express');

const router = express.Router();

// API

// Get group by id
router.param('id', (req, res, next) => {
    next();
});

router.get('/:id', (req, res, next) => {
    next();
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const groupServiceInstance = new GroupService();
    const group = await groupServiceInstance.getGroupById(id);

    if (!id) {
        logError(req.method, req.params, 'NO ID PROVIDED');
        res.status(404).json({
            message: `NO ID PROVIDED`,
        }).end();
    }

    if (!group) {
        logError(req.method, req.params, `GROUP WITH ID: '${id}'  NOT FOUND :(`);
        res.status(404).json({
            message: `GROUP WITH ID: '${id}'  NOT FOUND :(`,
        });
    } else {
        res.json(group);
    }
    res.end();
});

// Create group.
router.post('/', (req, res, next) => {
    next();
});

router.post('/', validateSchema(groupSchema), async (req, res) => {
    const keysLength = Object.keys(req.body).length;
    if (keysLength === 0) {
        logError(req.method, JSON.stringify(req.body), `Not payload found!`);
        res.status(400).json({
            message: `Not payload found!`,
        }).end();
    }
    if (keysLength < 3) {
        logError(req.method, JSON.stringify(req.body), `Missing fields!`);
        res.status(400).json({
            message: `Missing fields!`,
        }).end();
    }

    const { id, name, permissions } = req.body;
    const groupServiceInstance = new GroupService();
    const group = await groupServiceInstance.getGroupById(id);

    const isIdAlreadyUsed = !!group;
    if (isIdAlreadyUsed) {
        logError(req.method, JSON.stringify(req.body), `ID: '${id}' is already used`);
        res.status(404).json({
            message: `ID: '${id}' is already used`,
        });
    } else {
        const newGroup = await groupServiceInstance.createGroup({ id, name, permissions });
        if (!newGroup) {
            logError(req.method, JSON.stringify(req.body), `Error creating new group with info ${newGroup}`);
            res.status(404).json({
                message: `Error creating new group with info ${newGroup}`,
            });
        } else {
            res.status(200);
        }
    }
    res.end();
});

// Update group
router.put('/', (req, res, next) => {
    next();
});

router.put('/', validateSchema(groupSchema), async (req, res) => {
    const groupInfo = req.body;
    const id = groupInfo.id;
    const groupServiceInstance = new GroupService();
    const group = await groupServiceInstance.getGroupById(id);

    if (!group) {
        logError(req.method, JSON.stringify(req.body), `GROUP WITH ID: '${id}'  NOT FOUND :(`);
        res.status(404).json({
            message: `GROUP WITH ID: '${id}'  NOT FOUND :(`,
        });
    } else {
        const updatedGroup = await groupServiceInstance.updateGroup(groupInfo);
        if (!updatedGroup) {
            logError(req.method, JSON.stringify(req.body), `Error creating new group with info ${updatedGroup}`);
            res.status(404).json({
                message: `Error updating info ${groupInfo} for group with ID: '${id}'`,
            });
        }
        else {
            res.status(200);
        }
    }
    res.end();
});

// List groups
router.get('/listGroups', (req, res, next) => {
    next();
});

router.get('/listGroups', async (req, res) => {
    const groupServiceInstance = new GroupService();
    const groups = await groupServiceInstance.listGroups();

    res.status(200).json({
        results: groups,
    }).end();
});

// Delete groups
router.delete('/', (req, res, next) => {
    next();
});

router.delete('/', async (req, res) => {
    const { id } = req.query;
    const groupServiceInstance = new GroupService();
    const deletedGroup = await groupServiceInstance.deleteGroup(id);
    if (!deletedGroup) {
        logError(req.method, JSON.stringify(req.query), `Error deleting group with ID: '${id}'`);
        res.status(404).json({
            message: `Error deleting group with ID: '${id}'`,
        });
    }
    else {
        res.status(200);
    }
    res.end();
});

module.exports = router;
