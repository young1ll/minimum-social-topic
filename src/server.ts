import app from './app';
import db from './utils/dbseed';

const PORT = process.env.PORT || 8000;

export const startServer = async () => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });

    process.on('uncaughtException', async (error) => {
        console.log(error);
        process.exit(1);
    });
};

startServer().then(() => {
    console.log('SERVER IS UP');
});

db.sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
});
