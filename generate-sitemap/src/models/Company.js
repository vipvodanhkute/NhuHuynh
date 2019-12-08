import { Sequelize, sequelize } from '../services/dbService';

const Model = Sequelize.Model;
class Company extends Model { }
Company.init({
	// attributes
	Id: {
		type: Sequelize.BIGINT,
		primaryKey: true,
		allowNull: false
	},
	Type: Sequelize.INTEGER,
	Code: Sequelize.TEXT(256),
	Name: Sequelize.TEXT(256),
	UrlInfo: Sequelize.TEXT(256),
	IsPrgStatus: Sequelize.INTEGER,
}, {
		// options
		sequelize,
		modelName: 'Company',
		freezeTableName: true,
		timestamps: false
	});

export default Company;