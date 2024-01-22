import { Dialect, Sequelize } from 'sequelize';
import dbConfig from '../config/db.config';

const sequelize = new Sequelize({
    database: dbConfig.DB,
    username: dbConfig.USER,
    password: dbConfig.PASSWORD,
    host: dbConfig.HOST,
    dialect: dbConfig.dialect as Dialect,
    port: dbConfig.PORT || 3306,
});
const db = {
    Sequelize: Sequelize,
    sequelize,
};

export default db;
