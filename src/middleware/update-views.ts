import { getViewsByTopicIdFromRedis, incrementView, redisConnection } from '@/utils/redis';
import { NextFunction, Request, Response } from 'express';

/**
 *** REDIS CACHING ***
 *
 * 각 토픽에 대한 조회수를 캐시 데이터베이스에 업데이트합니다.
 */

export interface ViewRequest extends Request {
    view?: number;
}

export const getViewFromRedis = async (req: ViewRequest, res: Response, next: NextFunction) => {
    const { topicId } = req.query;
    try {
        const views = await getViewsByTopicIdFromRedis(topicId as string);
        req.view = views;

        next();
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
};

export const updateAndGetViewOnRedis = async (
    req: ViewRequest,
    res: Response,
    next: NextFunction
) => {
    const { topicId } = req.query;
    try {
        await incrementView(topicId as string);
        const views = await getViewsByTopicIdFromRedis(topicId as string);
        req.view = views;

        next();
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
};
