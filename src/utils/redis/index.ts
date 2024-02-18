import { Redis } from 'ioredis';
import { redisConfig } from '@/config';

export const redisConnection = new Redis({
    host: 'localhost',
    port: 6379,
    // host: redisConfig.HOST || '0.0.0.0',
    // port: redisConfig.PORT,
    // username: redisConfig.USER,
    // password: redisConfig.PASSWORD,
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
        const matches = key.match(/topic:([^:]+):view/);

        return matches ? matches[1] : null;
    });

    const updatedTopicIds = topicIds.filter((id) => id !== null);
    return updatedTopicIds;
};

export const clearCachedView = async () => {
    try {
        // 여기에서는 예시로 'topic'이라는 패턴의 키를 가진 데이터를 모두 제거합니다.
        const keysToDelete = await redisConnection.keys('topic:*:view');

        if (keysToDelete.length > 0) {
            await redisConnection.del(...keysToDelete);
            console.log('Cached data cleared successfully.');
        } else {
            console.log('No cached data found.');
        }
    } catch (error) {
        const err = error as Error;
        console.error('Error clearing cached data:', err.message);
    }
};

export { incrementView, getViewsByTopicIdFromRedis } from './view.redis';
