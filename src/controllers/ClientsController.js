const ClientModel = require('../models/ClientModel');
const { ClientNotFoundError, RequestError } = require('../errors');
const validator = require('../helpers/validator');
const pgp = require('pg-promise');

const { queryResultErrorCode } = pgp.errors;

class ClientsController {
	// GET - Returns a list of clients
	static async get() {
		return ClientModel.getList();
	}

	// GET - Returns one client by ID
	static async getOne(req) {
		const { clientId } = req.params;

		return ClientModel.getOne(clientId);
	}

	// POST - Create a client
	static async createOne(req) {
		await validator.validate('ClientModel', req.body);

		return ClientModel.createOne(req.body);
	}

	// PUT - Update a client
	static async updateOne(req) {
		await validator.validate('ClientUpdateModel', req.body);
		const { clientId } = req.params;
		const data = {
			clientId,
			...req.body,
		};
		try {
			return await ClientModel.updateOne(data);
		} catch (error) {
			if (error.code === queryResultErrorCode.noData) {
				throw new ClientNotFoundError();
			}
			throw new RequestError(data, error.message, 500);
		}
	}

	// DELETE - Delete a client
	static async deleteOne(req) {
		const { clientId } = req.params;

		await ClientModel.deleteById(clientId);

		return { message: 'success' };
	}
}


module.exports = ClientsController;