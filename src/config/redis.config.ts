export default {
    HOST: process.env.REDIS_HOST!,
    PORT: process.env.REDIS_PORT! as unknown as number,
    USER: process.env.REDIS_USER!,
    PASSWORD: process.env.REDIS_PASSWORD!,
};
