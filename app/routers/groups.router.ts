// Setup
import { PermissionEnum } from '@app/types'
import { GroupService } from '@app/services';
import express = require('express');
import Joi = require('@hapi/joi');
const app: express.Application = express();
const port = process.env.PORT || 3000;

// Config
app.use(express.json());
app.set('case sensitive routing', true);
app.set('strict routing', true);
app.set('x-powered-by', false);

const groupSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    permissions: Joi.array().required().items(
        Joi.string().valid(PermissionEnum.READ, PermissionEnum.WRITE, PermissionEnum.DELETE, PermissionEnum.SHARE, PermissionEnum.UPLOAD_FILES)),
});

// API

app.use((req, res, next) => {
    next();
});

// Get group by id
app.param('id', (req, res, next) => {
    next();
});

app.get('/group/:id', (req, res, next) => {
    next();
});

app.get('/group/:id', async (req, res) => {
    const { id } = req.params;
    const groupServiceInstance = new GroupService();
    const group = await groupServiceInstance.getGroupById(id);

    if (!id) {
        res.status(404).json({
            message: `NO ID PROVIDED`,
        }).end();
    }

    if (!group) {
        res.status(404).json({
            message: `GROUP WITH ID: '${id}'  NOT FOUND :(`,
        });
    } else {
        res.json(group);
    }
    res.end();
});

// Create group.
app.post('/group', (req, res, next) => {
    next();
});

app.post('/group', validateSchema(groupSchema), async (req, res) => {
    const keysLength = Object.keys(req.body).length;
    if (keysLength === 0) {
        res.status(400).json({
            message: `Not payload found!`,
        }).end();
    }
    if (keysLength < 3) {
        res.status(400).json({
            message: `Missing fields!`,
        }).end();
    }

    const { id, name, permissions } = req.body;
    const groupServiceInstance = new GroupService();
    const group = await groupServiceInstance.getGroupById(id);

    const isIdAlreadyUsed = !!group;
    if (isIdAlreadyUsed) {
        res.status(404).json({
            message: `ID: '${id}' is already used`,
        });
    } else {
        const newGroup = await groupServiceInstance.createGroup({ id, name, permissions });
        if (!newGroup) {
            res.status(404).json({
                message: `Error creating new group with info ${newGroup}`,
            });
        } else {
            res.status(200);
        }
    }
    res.end();
});

app.put('/group', (req, res, next) => {
    next();
});

app.put('/group', validateSchema(groupSchema), async (req, res) => {
    const groupInfo = req.body;
    const id = groupInfo.id;
    const groupServiceInstance = new GroupService();
    const group = await groupServiceInstance.getGroupById(id);

    if (!group) {
        res.status(404).json({
            message: `GROUP WITH ID: '${id}'  NOT FOUND :(`,
        });
    } else {
        const updatedGroup = await groupServiceInstance.updateGroup(groupInfo);
        if (!updatedGroup) {
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

app.get('/listGroups', (req, res, next) => {
    next();
});

app.get('/listGroups', async (req, res) => {
    const groupServiceInstance = new GroupService();
    const groups = await groupServiceInstance.listGroups();

    res.status(200).json({
        results: groups,
    }).end();
});

app.delete('/group:id', (req, res, next) => {
    next();
});

app.delete('/group', async (req, res) => {
    const { id } = req.query;
    const groupServiceInstance = new GroupService();
    const deletedGroup = await groupServiceInstance.deleteGroup(id);
    if (!deletedGroup) {
        res.status(404).json({
            message: `Error deleting group with ID: '${id}'`,
        });
    }
    else {
        res.status(200);
    }
    res.end();
});

// Error handling

app.use((err, req, res, next) => {
    console.error(err.stack);
    next(err);
});

// Start
app.listen(port, () => console.log(`App listening on port ${port}!`));

// error mapping.
function errorResponse(schemaErrors) {
    const errors = schemaErrors.map((error: Joi.ErrorReport) => {
        return { path: error.path, message: error.message };
    });
    return {
        status: 'failed',
        errors,
    }
}

// Middleware validation
function validateSchema(schema) {
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
