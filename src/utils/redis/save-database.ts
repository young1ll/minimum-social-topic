import db from '@/models';
import { getViewsByTopicIdFromRedis } from './view.redis';
import { clearCachedView, getUpdatedTopicIds } from '.';

export const updateViewInDatabase = async () => {
    // cache key 가져오기
    const topicIds = await getUpdatedTopicIds();

    for (const topicId of topicIds) {
        const view = await getViewsByTopicIdFromRedis(topicId as string);

        await db.Topic.update(
            { view },
            {
                where: { id: topicId },
            }
        );
    }

    await clearCachedView(); // 완료 후 캐시 클리어
};
