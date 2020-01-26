// Setup
const Joi = require('@hapi/joi');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Config
app.use(express.json());
app.set('case sensitive routing', true);
app.set('strict routing', true);
app.set('x-powered-by', false);

const schema = Joi.object({
    id: Joi.string().required(),
    login: Joi.string().required(),
    password: Joi.string().alphanum().required(),
    age: Joi.number().integer().min(4).max(130).required(),
    isDeleted: Joi.boolean().required(),
});

// Locals
app.locals.users = [
    {
        id: 'ID1',
        login: 'login1',
        password: 'password1',
        age: 10,
        isDeleted: false,
    },
    {
        id: 'ID2',
        login: 'login2',
        password: 'password2',
        age: 50,
        isDeleted: false,
    },
    {
        id: 'ID3',
        login: 'login3',
        password: 'password3',
        age: 160,
        isDeleted: false,
    },
];

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

app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    const user = req.app.locals.users.find(element => element.id === id);
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

app.post('/user', validateSchema(schema), (req, res) => {
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
    const isIdAlreadyUsed = req.app.locals.users.some(element => element.id === id);
    if (isIdAlreadyUsed) {
        res.status(404).json({
            message: `ID: '${id}' is already used`,
        });
    }
    else {
        req.app.locals.users.push({ id, login, password, age, isDeleted });
        res.status(200);
    }
    res.end();
});

app.put('/user', (req, res, next) => {
    next();
});

app.put('/user', validateSchema(schema), (req, res) => {
    const { id } = req.body;
    const userIndex = req.app.locals.users.findIndex(element => element.id === id);
    if (userIndex === -1) {
        res.status(404).json({
            message: `USER WITH ID: '${id}'  NOT FOUND :(`,
        });
    } else {
        req.app.locals.users[userIndex] = req.body;
        res.status(200);
    }
    res.end();
});

app.get('/AutoSuggestUsers', (req, res, next) => {
    next();
});

app.get('/AutoSuggestUsers', (req, res) => {
    const { loginSubstring, limit } = req.query;;
    const suggestion =
        req.app.locals.users.filter(element => element.id.includes(loginSubstring))
            .sort((a, b) => (a.id > b.id) ? 1 : -1)
            .slice(0, limit || 5);

    res.status(200).json({
        results: suggestion,
    }).end();
});

app.delete('/user:id', (req, res, next) => {
    next();
});

app.delete('/user', (req, res) => {
    const { id } = req.query;
    const userIndex = req.app.locals.users.findIndex(element => element.id === id);
    if (userIndex === -1) {
        res.status(404).json({
            message: `USER WITH ID: '${id}'  NOT FOUND :(`,
        });
    } else {
        req.app.locals.users[userIndex].isDeleted = true;
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
    const errors = schemaErrors.map((error) => {
        return { path, message } = error;
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