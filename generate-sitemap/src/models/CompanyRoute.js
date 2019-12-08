import { Sequelize, sequelize } from '../services/dbService';

const Model = Sequelize.Model;
class CompanyRoute extends Model { }
CompanyRoute.init({
    // attributes
    Id: Sequelize.INTEGER,
    BusOperatorId: Sequelize.INTEGER,
    TripId: Sequelize.INTEGER,
    BusStopId: Sequelize.INTEGER,
    Name: Sequelize.TEXT(256),
}, {
        // options
        sequelize,
        modelName: 'CompanyRoute',

    });

export default CompanyRoute;