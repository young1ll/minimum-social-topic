import { redisConnection } from '.';

export const incrementView = async (id: string) => {
    const key = `topic:${id}:view`;
    await redisConnection.incr(key);
};

export const getViewsByTopicIdFromRedis = async (id: string) => {
    const key = `topic:${id}:view`;
    const result = await redisConnection.get(key);
    return parseInt(result as string) || 0;
};
