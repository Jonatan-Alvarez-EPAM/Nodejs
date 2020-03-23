// login.router.js - Login route module
import { APP_SECRET_KEY } from '../data-access'
import { UserService } from '../services';
import { validateSchema, loginSchema } from '.';
import { logError } from '../logger';
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// API

// Authorize user
router.post('/', (req, res, next) => {
    next();
});

router.post('/', validateSchema(loginSchema), async (req, res) => {
    const { username, password } = req.body;
    const userServiceInstance = new UserService();
    const user = await userServiceInstance.authenticate(username, password);
    if (!username || !password) {
        logError(req.method, JSON.stringify(req.body), 'Not payload found!');
        res.status(403).json({
            message: 'Not payload found!',
        }).end();
    }

    if (!user) {
        logError(req.method, JSON.stringify(req.body), 'Invalid username or password.');
        res.status(404).json({
            message: 'Invalid username or password.',
        }).end();
    } else {
        const tokenData = { sub: user.id };
        const token = jwt.sign(tokenData, APP_SECRET_KEY, { expiresIn: '10m' });
        res.send(token);
    }
});

module.exports = router;