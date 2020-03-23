export { };
const request = require('supertest');
const app = require('../app');

describe('user router tests', () => {
    let token;

    beforeAll(async () => {
        const resp = await request(app)
            .post('/login')
            .send({
                username: 'TEST',
                password: 'TEST',
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        token = resp.text;
    });

    test('Get non-existing user', async () => {
        const id = 'non-existing-id';

        const resp = await request(app)
            .get(`/user/${id}`)
            .set('x-access-token', token);

        expect(resp.statusCode).toBe(404);
        expect(resp.text)
            .toBe(JSON.stringify({ message: `USER WITH ID: '${id}'  NOT FOUND :(` }));
    });

    test('Get existing user', async () => {
        const id = 'TEST';

        const resp = await request(app)
            .get(`/user/${id}`)
            .set('x-access-token', token);

        expect(resp.statusCode).toBe(200);
        expect(resp.text)
            .toBe(JSON.stringify({
                id: id,
                login: id,
                password: id,
                age: 0,
                isDeleted: true
            }));
    });

    test('Create user with id already existing', async () => {
        const id = 'TEST';

        const resp = await request(app)
            .post('/user')
            .send({
                id: id,
                login: 'TEST2',
                password: 'TEST2',
                age: 15,
                isDeleted: true
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('x-access-token', token);

        expect(resp.statusCode).toBe(404);
        expect(resp.text)
            .toBe(JSON.stringify({
                message: `ID: '${id}' is already used`,
            }));
    });

    test('Update user with non-existing id', async () => {
        const id = 'non-existing-id';

        const resp = await request(app)
            .put('/user')
            .send({
                id: id,
                login: 'TEST2',
                password: 'TEST2',
                age: 15,
                isDeleted: true
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('x-access-token', token);

        expect(resp.statusCode).toBe(404);
        expect(resp.text)
            .toBe(JSON.stringify({
                message: `USER WITH ID: '${id}'  NOT FOUND :(`,
            }));
    });

    test('Get list of suggested users', async () => {
        const loginSubstring = 'ST';
        const limit = 5;

        const resp = await request(app)
            .get(`/user/AutoSuggestUsers?loginSubstring=${loginSubstring}&limit=${limit}`)
            .set('x-access-token', token);

        expect(resp.statusCode).toBe(200);
        expect(resp.text)
            .toBe(JSON.stringify(
                {
                    results: [{
                        id: 'TEST',
                        login: 'TEST',
                        password: 'TEST',
                        age: 0,
                        isDeleted: true
                    }]
                }
            ));
    });

    test('Delete user', async () => {
        const id = 'TEST';

        const resp = await request(app)
            .delete(`/user?id=${id}`)
            .set('x-access-token', token);

        expect(resp.statusCode).toBe(200);
    });
});