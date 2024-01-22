import {
    DeleteTopicReq,
    GetAllTopicReq,
    GetTopicReq,
    TopicCreateReq,
    UpdateTopicReq,
} from '@/dto/topic.dto';
import { TopicRepository } from '@/repository/topic.repo';
import { TopicService } from '@/services/topic.service';
import { RequestValidator } from '@/utils/request-validator';
import e, { NextFunction, Request, Response } from 'express';

const router = e.Router();
export const topicService = new TopicService(new TopicRepository());

// POST /topic - Create a new topic
router.post('/topic', async (req: Request, res: Response) => {
    try {
        const { errors, input } = await RequestValidator(TopicCreateReq, req.body);
        if (errors) return res.status(400).json({ errors });

        const { userId, title, type, ...rest } = input;

        const data = await topicService.createTopic({
            userId,
            title,
            type,
            ...rest,
        });

        return res.status(200).json({ data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

// GET /topic - Get topic by userId and topicId
// query: userId, topicId
router.get('/topic', async (req: Request, res: Response) => {
    try {
        const { errors, input } = await RequestValidator(GetTopicReq, {
            userId: req.query.userId,
            topicId: req.query.topicId,
        });
        if (errors) return res.status(400).json({ errors });

        const { userId, topicId } = input;
        const data = await topicService.getTopicByUserIdAndId(userId as string, topicId as string);

        return res.status(200).json({ data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

// GET /topic - Get all topics by userId
// query: userId | q
router.get('/topics', async (req: Request, res: Response) => {
    try {
        let data;
        const { userId, q } = req.query;

        if (!userId && !q) {
            //TODO : return all topics
        } else if (!userId && q) {
            data = await topicService.searchTopic(q as string);
        } else if (!q && userId) {
            const { errors, input } = await RequestValidator(GetAllTopicReq, {
                userId: req.query.userId,
            });
            if (errors) return res.status(400).json({ errors });

            data = await topicService.getAllTopicsByUserId(input.userId as string);
        }

        return res.status(200).json({ data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

// GET /tocpic-count - Get topic count
// query: userId
router.get('/topic-count', async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        const count = await topicService.count(userId as string);

        return res.status(200).json({ count });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

router.put('/topic', async (req: Request, res: Response) => {
    try {
        const { errors, input } = await RequestValidator(UpdateTopicReq, req.body);
        if (errors) return res.status(400).json({ errors });

        const { topicId, userId, ...rest } = input;
        const data = await topicService.updateTopicById(topicId, rest);

        if (data == 0) {
            return res.status(200).json({ message: 'No Data Updated', data });
        } else {
            const result = await topicService.getTopicByUserIdAndId(userId, topicId);

            return res.status(200).json({ message: 'Data Updated Successfully', result });
        }
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

router.delete('/topic', async (req: Request, res: Response) => {
    try {
        const { errors, input } = await RequestValidator(DeleteTopicReq, req.body);
        if (errors) return res.status(400).json({ errors });

        const { topicId, userId } = input;
        const data = await topicService.getTopicByUserIdAndId(userId, topicId);

        if (!data) {
            return res.status(400).json({ message: 'Data Not Found' });
        }
        const result = await topicService.deleteTopicById(topicId);

        if (result == 0) {
            return res.status(200).json({ message: 'No Data Deleted' });
        }

        return res
            .status(200)
            .json({ message: 'Data Deleted Successfully', data: { deleted: result, data } });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

export default router;
