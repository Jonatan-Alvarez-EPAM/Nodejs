import { logError } from '../logger';
const jwt = require('jsonwebtoken');

export const APP_SECRET_KEY = 'YOU_ONLY_LIVE_ONCE';

// Checks that the authorization token is present and valid in request header.
export function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token) {
        logError(req.method, JSON.stringify(req.body), 'No token provided!');
        return res.status(401).send({
            success: false,
            message: 'No token provided!',
        });
    }

    return jwt.verify(token, APP_SECRET_KEY, function (err, decoded) {
        if (err) {
            logError(req.method, JSON.stringify(req.body), 'Header has invalid token!');
            return res.status(403).send({
                success: false,
                message: 'Header has invalid token!',
            });
        }

        return next();
    });
};