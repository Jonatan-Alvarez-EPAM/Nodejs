// Setup
import { UserService } from '@app/services';
import express = require('express');
import Joi = require('@hapi/joi');
const app: express.Application = express();
const port = process.env.PORT || 3000;

// Config
app.use(express.json());
app.set('case sensitive routing', true);
app.set('strict routing', true);
app.set('x-powered-by', false);

const userSchema = Joi.object({
    id: Joi.string().required(),
    login: Joi.string().required(),
    password: Joi.string().alphanum().required(),
    age: Joi.number().integer().min(4).max(130).required(),
    isDeleted: Joi.boolean().required(),
});

// API

app.use((req, res, next) => {
    console.log(Date.now());
    next();
});

// Get user by id
app.param('id', (req, res, next) => {
    next();
});

app.get('/user/:id', (req, res, next) => {
    next();
});

app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const userServiceInstance = new UserService();
    const user = await userServiceInstance.getUserById(id);

    if (!id) {
        res.status(404).json({
            message: `NO ID PROVIDED`,
        }).end();
    }

    if (!user) {
        res.status(404).json({
            message: `USER WITH ID: '${id}'  NOT FOUND :(`,
        });
    } else {
        res.json(user);
    }
    res.end();
});

// Create user.
app.post('/user', (req, res, next) => {
    next();
});

app.post('/user', validateSchema(userSchema), async (req, res) => {
    const keysLength = Object.keys(req.body).length;
    if (keysLength === 0) {
        res.status(400).json({
            message: `Not payload found!`,
        }).end();
    }
    if (keysLength < 5) {
        res.status(400).json({
            message: `Missing fields!`,
        }).end();
    }

    const { id, login, password, age, isDeleted } = req.body;
    const userServiceInstance = new UserService();
    const user = await userServiceInstance.getUserById(id);

    const isIdAlreadyUsed = !!user;
    if (isIdAlreadyUsed) {
        res.status(404).json({
            message: `ID: '${id}' is already used`,
        });
    } else {
        const newUser = await userServiceInstance.createUser({ id, login, password, age, isDeleted });
        if (!newUser) {
            res.status(404).json({
                message: `Error creating new user with info ${newUser}`,
            });
        } else {
            res.status(200);
        }
    }
    res.end();
});

app.put('/user', (req, res, next) => {
    next();
});

app.put('/user', validateSchema(userSchema), async (req, res) => {
    const userInfo = req.body;
    const id = userInfo.id;
    const userServiceInstance = new UserService();
    const user = await userServiceInstance.getUserById(id);

    if (!user) {
        res.status(404).json({
            message: `USER WITH ID: '${id}'  NOT FOUND :(`,
        });
    } else {
        const updatedUser = await userServiceInstance.updateUser(userInfo);
        if (!updatedUser) {
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

app.get('/AutoSuggestUsers', (req, res, next) => {
    next();
});

app.get('/AutoSuggestUsers', async (req, res) => {
    const { loginSubstring, limit } = req.query;
    const userServiceInstance = new UserService();
    const suggestions = await userServiceInstance.listUsers(loginSubstring, limit);

    res.status(200).json({
        results: suggestions,
    }).end();
});

app.delete('/user:id', (req, res, next) => {
    next();
});

app.delete('/user', async (req, res) => {
    const { id } = req.query;
    const userServiceInstance = new UserService();
    const deletedUser = await userServiceInstance.deleteUser(id);
    if (!deletedUser) {
        res.status(404).json({
            message: `Error deleting user with ID: '${id}'`,
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
