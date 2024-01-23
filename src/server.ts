import app from './app';

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
