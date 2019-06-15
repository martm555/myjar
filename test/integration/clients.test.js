const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./../../src/app');

const { expect } = chai;

chai.use(chaiHttp);
chai.should();

const ClientModel = require('./../../src/models/ClientModel');

describe('/api/v1/clients/:clientId', async () => {

	it('#put should return 400', async () => {
		const result = await chai.request(app).put('/api/v1/clients/27f30e0c-00c8-4605-a6a0-40a33712dab2');
		result.should.have.status(400);
	});

	it('#put should return 404', async () => {
		const res = await chai.request(app).put('/api/v1/clients/27f30e0c-00c8-4605-a6a0-40a33712dab2').send({
			firstname: 'Mart',
			surname: 'Madisson',
		});
		res.should.have.status(404);
	});

	it('#put should return 200', async () => {
		const [client] = await ClientModel.getList();
		expect(client).to.not.be.equal(undefined);
		const data = {
			firstname: 'Mart',
			surname: 'Madisson',
		};
		const result = await chai.request(app).put(`/api/v1/clients/${client.id}`).send(data);
		result.should.have.status(200);
		const updated = await ClientModel.getOne(client.id);
		expect(updated).to.not.be.equal(undefined);
		expect(updated.firstname).to.not.be.equal(client.firstname);
		expect(updated.surname).to.not.be.equal(client.surname);
		expect(updated.phoneNumber).to.be.equal(client.phoneNumber);
	});
});
