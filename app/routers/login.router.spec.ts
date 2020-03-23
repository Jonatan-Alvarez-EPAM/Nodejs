export { };
const request = require('supertest');
const app = require('../app');

describe('login router tests', () => {
    test('should prevent any action if authorization token is not present in request header', async () => {
        const resp = await request(app).get('/any-action');

        expect(resp.statusCode).toBe(401);
        expect(resp.text)
            .toBe(JSON.stringify({ success: false, message: 'No token provided!' }));
    });

    test('invalid username or password', async () => {
        const resp = await request(app)
            .post('/login')
            .send({
                username: 'nonExistingUser',
                password: 'iNvAL1Dp4ssW0Rd',
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        expect(resp.statusCode).toBe(404);
        expect(resp.text)
            .toBe(JSON.stringify({ message: 'Invalid username or password.' }));
    });

    test('creates token', async () => {
        const resp = await request(app)
            .post('/login')
            .send({
                username: 'TEST',
                password: 'TEST',
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        expect(resp.statusCode).toBe(200);
    });
});