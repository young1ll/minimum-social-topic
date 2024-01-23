import e, { NextFunction, Request, Response } from 'express';
import { RequestValidator } from '@/utils/request-validator';
import {
    DeleteTopicReq,
    DeleteTopicsReq,
    GetAllTopicReq,
    GetTopicReq,
    TopicCreateReq,
    UpdateTopicReq,
} from '@/dto/topic.dto';
import { TopicType, TypeCreateReq, isTopicType } from '@/dto/type.dto';

import { PollTopicAttributes } from '@/models/pollTopic.model';
import { EventTopicAttributes } from '@/models/eventTopic.model';
import { CandidateService, TopicService, TypeService } from '@/services';
import {
    CandidateRepository,
    EventRepository,
    PollRepository,
    TopicRepository,
} from '@/repository';

const topicRepo = new TopicRepository();
const pollRepo = new PollRepository();
const eventRepo = new EventRepository();
const candidateRepo = new CandidateRepository();

const router = e.Router();
export const topicService = new TopicService({ topicRepo });
export const typeService = new TypeService({ pollRepo, eventRepo });
export const candidateService = new CandidateService({ candidateRepo });

// POST /topic - Create a new topic
router.post('/topic', async (req: Request, res: Response) => {
    try {
        const {
            userId,
            type,
            title,
            status,
            isSecretVote,
            castingVote,
            resultOpen,
            startDate,
            endDate,
            content,
            eventDate,
            eventLocation,
        } = req.body;

        if (!isTopicType(type))
            return res.status(400).json({ error: 'Invalid type: type must be "poll" or "event"' });

        const topicReq = {
            userId,
            type,
            title,
            status,
            isSecretVote,
            castingVote,
            resultOpen,
            startDate,
            endDate,
        };

        // topic validation
        const { errors: topicValidErrors, input: topicInput } = await RequestValidator(
            TopicCreateReq,
            topicReq
        );
        if (topicValidErrors) return res.status(400).json({ topicValidErrors });

        const topicData = await topicService.createTopic({ ...topicInput });

        // type validation
        const { errors: typeInputValidErrors, input: typeInput } = await RequestValidator(
            TypeCreateReq,
            {
                topicId: topicData.id,
                content,
                eventDate,
                eventLocation,
            }
        );
        if (typeInputValidErrors) return res.status(400).json({ typeInputValidErrors });

        const typeData = await typeService.createType({
            type,
            input: typeInput as PollTopicAttributes | EventTopicAttributes,
        });

        // - [x] topic type data
        // - [ ] topic candidateItem datas

        const result = {
            ...topicData,
            ...typeData,
        };

        return res.status(200).json({ data: result });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

// GET /topic - Get topic by userId and topicId
// Detail 포함한 단일 Topic을 반환
// query: userId, topicId
router.get('/topic', async (req: Request, res: Response) => {
    try {
        const { errors, input } = await RequestValidator(GetTopicReq, {
            topicId: req.query.topicId,
        });
        if (errors) return res.status(400).json({ errors });

        const { topicId } = input;
        const topicData = await topicService.getTopicByTopicId(topicId as string);
        const type = topicData?.type as TopicType;
        const typeData = await typeService.getTypeByTopicId({ topicId: topicId as string, type });
        const candidateData = await candidateService.getAllCandidatesByTopicId(topicId as string);

        const result = {
            ...topicData,
            ...typeData,
            ...candidateData,
        };
        // - [x] topic type data
        // - [ ] topic candidateItem datas
        // - [ ] topic result data

        return res.status(200).json({ data: result });
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

        // 상세 데이터는 미포함
        // CandidateItemCount: 비정규화 컬럼

        return res.status(200).json({ data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

// GET /tocpic-count - Get topic count
// query: userId, type
router.get('/topic-count', async (req: Request, res: Response) => {
    try {
        const { userId, type } = req.query;

        if (type) {
            // type이 있다면 type 검사
            if (!isTopicType(type as string)) {
                return res
                    .status(400)
                    .json({ error: 'Invalid type: type must be "poll" or "event"' });
            }

            const count = await topicService.count(userId as string, type as TopicType);
            return res.status(200).json({ data: count });
        }

        const count = await topicService.count(userId as string);
        return res.status(200).json({ data: count });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

// PUT /topic - Update topic by topicId
router.put('/topic', async (req: Request, res: Response) => {
    try {
        const { errors, input } = await RequestValidator(UpdateTopicReq, req.body);
        if (errors) return res.status(400).json({ errors });

        const { topicId, userId, ...rest } = input;
        const data = await topicService.updateTopicById(topicId, rest);

        if (data == 0) {
            return res.status(200).json({ message: 'No Data Updated', data });
        } else {
            const result = await topicService.getTopicByTopicId(topicId);

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
        const data = await topicService.getTopicByTopicId(topicId);

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

// DELETE /topics - Delete topics by topicIds
// body: topicIds
// topicId 배열을 받아 해당하는 데이터 모두 제거
router.delete('/topics', async (req: Request, res: Response) => {
    try {
        const { errors, input } = await RequestValidator(DeleteTopicsReq, req.body);
        if (errors) return res.status(400).json({ errors });

        const { topicIds } = input;
        const data = await topicService.deleteTopicsById(topicIds);

        if (data == 0) {
            return res.status(200).json({ message: 'No Data Deleted' });
        }

        return res.status(200).json({ message: 'Data Deleted Successfully', data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

export default router;
