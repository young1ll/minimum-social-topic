import db from '@/models';
import { getViewsByTopicIdFromRedis } from './view.redis';
import { getUpdatedTopicIds } from '.';

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
};
