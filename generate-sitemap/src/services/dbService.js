import Sequelize from 'sequelize';
import redis from 'redis';
const config = require('config');

const mssqlConfig = config.get('mssql');
const redisConfig = config.get('redis');

const { user, password, server, port, database } = mssqlConfig;
const { host, port: portRedis } = redisConfig

const dbBMS = `mssql://${user}:${password}@${server}:${port}/${database}`;
const dbFE = `mssql://${user}:${password}@${server}:${port}/VXR_FE`;

let redisClient = null;
let sequelize = new Sequelize(dbBMS);
let sequelizeFE = new Sequelize(dbFE)

const connect = async () => {
    try {
        redisClient = redis.createClient(portRedis, host);
        console.log('connect Redis: ', host, portRedis)
        console.log('connecting mssql ', server)
      
        await sequelize.authenticate();
        // await sequelize.sync();
        console.log('Connection DB BMS successfully.');

        await sequelizeFE.authenticate();
        // await sequelize.sync();
        console.log('Connection DB FE successfully.');
    }
    catch (err) {
        console.error('Unable to connect to the database:', err.message);
        sequelize.close();
    }
}

const disconnect = () => {
    redisClient.quit();
    sequelize.close();
}

export const checkExistsRedis = (key, item) => {
    return new Promise(function (rs, rj) {
        client.exists(key, function (err, isExists) {
            if (!err && isExists) {
                // console.log(key)
                rs(item)
            }
            rs(false)
        })
    })
}

export { Sequelize, sequelize, connect, redisClient, disconnect, sequelizeFE };



