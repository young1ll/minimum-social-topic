import { Redis } from 'ioredis';
import { redisConfig } from '@/config';

export const redisConnection = new Redis({
    host: redisConfig.HOST,
    port: redisConfig.PORT,
    // username: redisConfig.USER,
    password: redisConfig.PASSWORD,
    reconnectOnError: (err: Error) => {
        const targetError = 'READONLY';
        if (err.message && err.message.slice(0, targetError.length) === targetError) {
            // Redis가 READONLY 상태이면 재연결을 시도하도록 설정
            return true;
        }
        return false;
    },
    showFriendlyErrorStack: true,
});

export const getUpdatedTopicIds = async () => {
    const keys = await redisConnection.keys('topic:*:view');

    const topicIds = keys.map((key) => {
        const matches = key.match(/topic:(\d+):view/);

        return matches ? matches[1] : null;
    });

    const updatedTopicIds = topicIds.filter((id) => id !== null);
    return updatedTopicIds;
};

export { incrementView, getViewsByTopicIdFromRedis } from './view.redis';
