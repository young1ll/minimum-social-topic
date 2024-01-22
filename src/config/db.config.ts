import dotenv from 'dotenv';

dotenv.config();

export default {
    HOST: process.env.MYSQL_DB_HOST!,
    USER: process.env.MYSQL_DB_USER!,
    PASSWORD: process.env.MYSQL_DB_PASSWORD!,
    DB: process.env.MYSQL_DB!,
    PORT: process.env.MYSQL_DB_PORT! as unknown as number,
    dialect: 'mysql',
};
