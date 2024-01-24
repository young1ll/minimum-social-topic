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

// TODO: 너무 복잡하면 컨트롤러로 모듈화

/**
 * @swagger
 * /topic:
 *   post:
 *     tags: [Topic]
 *     summary: 새로운 주제(투표) 생성
 *     description: 새로운 주제(투표)를 생성합니다. 주제의 타입('poll' 또는 'event')을 포함합니다.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: 타입('poll' 또는 'event')을 포함한 Body Prams로 새로운 주제 생성을 요청할 수 있습니다.
 *         schema:
 *           $ref: '#/definitions/CreateTopicBodyParams'
 *
 *     responses:
 *       200-POLL-CREATED:
 *         description: Successfully created Poll Topic.
 *         schema:
 *           $ref: '#/definitions/CreatePollSuccessResponse'
 *       200-EVENT-CREATED:
 *         description: Successfully created Event Topic.
 *         schema:
 *           $ref: '#/definitions/CreateEventSuccessResponse'
 *       400:
 *         description: Bad Request. Invalid type or validation errors.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message.
 *       500:
 *         description: Internal Server Error.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message.
 */
router.post('/topic', async (req: Request, res: Response) => {
    //TODO: 타입에 따라 body 파라미터를 구분해 에러를 반환
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
            description,
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
                description,
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

/**
 * @swagger
 * /topic:
 *   get:
 *     tags: [Topic]
 *     summary: 단일 Topic 가져오기(상세)
 *     description: 특정 Topic의 상세를 가져옵니다. topicId가 필요합니다.
 *     parameters:
 *       - in: query
 *         name: topicId
 *         required: true
 *         description: ID of the topic to retrieve details.
 *         schema:
 *           type: string
 *     responses:
 *       200-POLL-DETAILS:
 *         description: Successful response with poll topic details.
 *         schema:
 *           $ref: '#/definitions/GetPollTopicResponse'
 *       200-EVENT-DETAILS:
 *         description: Successful response with event topic details.
 *         schema:
 *           $ref: '#/definitions/GetEventTopicResponse'
 *       400:
 *         description: Bad Request. Invalid input or validation errors.
 *         schema:
 *           type: object
 *           properties:
 *             errors:
 *               type: array
 *               items:
 *                 type: string
 *               description: Error messages.
 *       500:
 *         description: Internal Server Error.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message.
 */
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

        const { id, topicId: typeTopicId, ...typeDataWithoutId } = typeData || {};
        // type의 id와 topicId 제외

        const result = {
            ...topicData,
            ...typeDataWithoutId,
            candidates: candidateData,
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

/**
 * @swagger
 * /topics:
 *   get:
 *     tags: [Topic]
 *     summary: Topic 목록 가져오기
 *     description: Topic 요약 목록 가져오기. query로 title 검색이 가능합니다.
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: ID of the user to filter topics.
 *         schema:
 *           type: string
 *       - in: query
 *         name: q
 *         description: Query string for searching topics.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with topic data.
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/GetTopicArrayResponse'
 *       400:
 *         description: Bad Request. Invalid input or validation errors.
 *         schema:
 *           type: object
 *           properties:
 *             errors:
 *               type: array
 *               items:
 *                 type: string
 *               description: Error messages.
 *       500:
 *         description: Internal Server Error.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message.
 */
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

/**
 * @swagger
 * /topic-count:
 *   get:
 *     tags: [Topic]
 *     summary: Topic 갯수 가져오기
 *     description: 모든 Topic의 갯수를 가져옵니다. query로 type 검색이 가능합니다. "poll"와 "event"를 사용할 수 있습니다.
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: ID of the user to filter topics.
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         description: Type of the topic ("poll" or "event").
 *         schema:
 *           type: string
 *           enum: ['poll', 'event']
 *     responses:
 *       200:
 *         description: Successful response with topic count.
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: number
 *               description: Count of topics.
 *       400:
 *         description: Bad Request. Invalid input or validation errors.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message.
 *       500:
 *         description: Internal Server Error.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message.
 */
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

/**
 * @swagger
 * /topic:
 *   put:
 *     tags: [Topic]
 *     summary: Topic 수정하기
 *     description: Update an existing topic based on the provided data.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Updated data for the topic.
 *         schema:
 *           $ref: '#/definitions/UpdateTopicBodyParams'
 *     responses:
 *       200:
 *         description: Successful response with updated topic data.
 *         schema:
 *           $ref: '#/definitions/UpdateTopicSuccessResponse'
 *       400:
 *         description: Bad Request. Invalid input or validation errors.
 *         schema:
 *           type: object
 *           properties:
 *             errors:
 *               type: object
 *               description: Validation errors.
 *       500:
 *         description: Internal Server Error.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message.
 */
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

/**
 * @swagger
 * /topic:
 *   delete:
 *     tags: [Topic]
 *     summary: Delete a topic
 *     description: Delete an existing topic based on the provided data.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Data for the topic to be deleted.
 *         schema:
 *           $ref: '#/definitions/DeleteTopicBodyParams'
 *     responses:
 *       200:
 *         description: Successful response with deleted topic data.
 *         schema:
 *           $ref: '#/definitions/DeleteTopicSuccessResponse'
 *       400:
 *         description: Bad Request. Invalid input or data not found.
 *         schema:
 *           type: object
 *           properties:
 *             errors:
 *               type: object
 *               description: Validation errors or data not found message.
 *       500:
 *         description: Internal Server Error.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message.
 */
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

/**
 * @swagger
 * /topics:
 *   delete:
 *     tags: [Topic]
 *     summary: Delete multiple topics
 *     description: Delete multiple existing topics based on the provided data.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Data for the topics to be deleted.
 *         schema:
 *           $ref: '#/definitions/DeleteTopicsBodyParams'
 *     responses:
 *       200:
 *         description: Successful response with deleted topics data.
 *         schema:
 *           $ref: '#/definitions/DeleteTopicsSuccessResponse'
 *       400:
 *         description: Bad Request. Invalid input or data not found.
 *         schema:
 *           type: object
 *           properties:
 *             errors:
 *               type: object
 *               description: Validation errors or data not found message.
 *       500:
 *         description: Internal Server Error.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message.
 */
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
