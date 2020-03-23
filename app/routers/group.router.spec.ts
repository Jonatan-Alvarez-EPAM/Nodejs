export { };
const request = require('supertest');
const app = require('../app');

describe('group router tests', () => {
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

    test('Get non-existing group', async () => {
        const id = 'non-existing-id';

        const resp = await request(app)
            .get(`/group/${id}`)
            .set('x-access-token', token);

        expect(resp.statusCode).toBe(404);
        expect(resp.text)
            .toBe(JSON.stringify({
                message: `GROUP WITH ID: '${id}'  NOT FOUND :(`,
            }));
    });

    test('Get existing group', async () => {
        const id = 'TEST';

        const resp = await request(app)
            .get(`/group/${id}`)
            .set('x-access-token', token);

        expect(resp.statusCode).toBe(200);
        expect(resp.text)
            .toBe(JSON.stringify({
                id: id,
                name: id,
                permissions: []
            }));
    });

    test('Create group with id already existing', async () => {
        const id = 'TEST';

        const resp = await request(app)
            .post('/group')
            .send({
                id: id,
                name: 'TEST2',
                permissions: []
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

    test('Update group with non-existing id', async () => {
        const id = 'non-existing-id';

        const resp = await request(app)
            .put('/group')
            .send({
                id: id,
                name: 'TEST2',
                permissions: []
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('x-access-token', token);

        expect(resp.statusCode).toBe(404);
        expect(resp.text)
            .toBe(JSON.stringify({
                message: `GROUP WITH ID: '${id}'  NOT FOUND :(`,
            }));
    });

    test('Get list of groups', async () => {
        const resp = await request(app)
            .get('/group/listGroups')
            .set('x-access-token', token);

        expect(resp.statusCode).toBe(200);
        expect(resp.text)
            .toBe(JSON.stringify(
                {
                    results: [{
                        id: 'TEST',
                        name: 'TEST',
                        permissions: []
                    }]
                }
            ));
    });

    test('Delete non-existing group', async () => {
        const id = 'non-existing-group';

        const resp = await request(app)
            .delete(`/group?id=${id}`)
            .set('x-access-token', token);

        expect(resp.statusCode).toBe(404);
        expect(resp.text)
            .toBe(JSON.stringify({
                message: `Error deleting group with ID: '${id}'`,
            }));
    });
});