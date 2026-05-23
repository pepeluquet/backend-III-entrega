import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import app from '../src/app.js';
import * as services from '../src/services/index.js';

const validId = '507f1f77bcf86cd799439011';
const validId2 = '507f1f77bcf86cd799439012';

describe('Adoption router - functional tests', () => {
    afterEach(() => sinon.restore());

    describe('GET /api/adoptions', () => {
        it('returns 200 and all adoptions on success', async () => {
            const adoptions = [{ _id: validId, owner: validId2, pet: validId2 }];
            sinon.stub(services.adoptionsService, 'getAll').resolves(adoptions);

            const res = await request(app).get('/api/adoptions');

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.payload).to.deep.equal(adoptions);
        });

        it('returns 500 when the service throws', async () => {
            sinon.stub(services.adoptionsService, 'getAll').rejects(new Error('Database error'));

            const res = await request(app).get('/api/adoptions');

            expect(res.status).to.equal(500);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.equal('Database error');
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('returns 200 and the adoption when found', async () => {
            const adoption = { _id: validId, owner: validId2, pet: validId2 };
            sinon.stub(services.adoptionsService, 'getBy').resolves(adoption);

            const res = await request(app).get(`/api/adoptions/${validId}`);

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.payload).to.deep.equal(adoption);
        });

        it('returns 400 for an invalid adoption id', async () => {
            const res = await request(app).get('/api/adoptions/invalid-id');

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.equal('Invalid adoption id');
        });

        it('returns 404 when the adoption does not exist', async () => {
            sinon.stub(services.adoptionsService, 'getBy').resolves(null);

            const res = await request(app).get(`/api/adoptions/${validId}`);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.equal('Adoption not found');
        });

        it('returns 500 when the service throws', async () => {
            sinon.stub(services.adoptionsService, 'getBy').rejects(new Error('Lookup failed'));

            const res = await request(app).get(`/api/adoptions/${validId}`);

            expect(res.status).to.equal(500);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.equal('Lookup failed');
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        const user = { _id: validId, pets: [] };
        const pet = { _id: validId2, adopted: false };

        it('returns 201 when adoption is created successfully', async () => {
            sinon.stub(services.usersService, 'getUserById').resolves(user);
            sinon.stub(services.petsService, 'getBy').resolves(pet);
            sinon.stub(services.usersService, 'update').resolves();
            sinon.stub(services.petsService, 'update').resolves();
            sinon.stub(services.adoptionsService, 'create').resolves();

            const res = await request(app).post(`/api/adoptions/${validId}/${validId2}`);

            expect(res.status).to.equal(201);
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Pet adopted');
        });

        it('returns 400 for invalid user or pet id', async () => {
            const res = await request(app).post('/api/adoptions/bad-user-id/bad-pet-id');

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.equal('Invalid user or pet id');
        });

        it('returns 404 when user is not found', async () => {
            sinon.stub(services.usersService, 'getUserById').resolves(null);

            const res = await request(app).post(`/api/adoptions/${validId}/${validId2}`);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.equal('User not found');
        });

        it('returns 404 when pet is not found', async () => {
            sinon.stub(services.usersService, 'getUserById').resolves(user);
            sinon.stub(services.petsService, 'getBy').resolves(null);

            const res = await request(app).post(`/api/adoptions/${validId}/${validId2}`);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.equal('Pet not found');
        });

        it('returns 400 when pet is already adopted', async () => {
            sinon.stub(services.usersService, 'getUserById').resolves(user);
            sinon.stub(services.petsService, 'getBy').resolves({ ...pet, adopted: true });

            const res = await request(app).post(`/api/adoptions/${validId}/${validId2}`);

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.equal('Pet is already adopted');
        });

        it('returns 500 when the service throws', async () => {
            sinon.stub(services.usersService, 'getUserById').rejects(new Error('Create failed'));

            const res = await request(app).post(`/api/adoptions/${validId}/${validId2}`);

            expect(res.status).to.equal(500);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.equal('Create failed');
        });
    });
});
