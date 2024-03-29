import e, { NextFunction, Request, Response } from 'express';
import { RequestValidator } from '@/utils/request-validator';
import {
    DeleteTopicReq,
    DeleteTopicsReq,
    GetAllTopicReq,
    GetTopicReq,
    TopicCreateReq,
    UpdateTopicReq,
    UpdateTopicViewReq,
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
import { ViewRequest, getViewFromRedis, updateAndGetViewOnRedis } from '@/middleware/update-views';
import { TopicAttributes } from '@/models/topic.model';

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
            startDate: new Date(startDate),
            endDate: new Date(endDate),
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
                ...(type === 'event' && { eventDate: new Date(eventDate) }),
                ...(type === 'event' && { eventLocation }),
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
router.get('/topic', updateAndGetViewOnRedis, async (req: ViewRequest, res: Response) => {
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

        const { view, ...topicDataWithoutViews } = topicData || {};
        const { id, topicId: typeTopicId, ...typeDataWithoutId } = typeData || {};
        // type의 id와 topicId 제외

        const result = {
            ...topicDataWithoutViews,
            view: req.view || view,
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
 *     description: Topic 요약 목록 가져오기. query 검색어로 title 검색이 가능합니다. 단, 현재 검색어 쿼리가 설정될 때, 정렬이 불가능 합니다(추후 개선 예정).
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for topics
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Sort order ('asc' or 'desc')
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter topics by user ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter topics by type
 *     responses:
 *       200:
 *         description: Successful response with topic data.
 *         schema:
 *           $ref: '#/definitions/GetTopicArrayResponse'
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
        const { q, page, ...rest } = req.query;
        const pageSize = 10;
        const currentPage = parseInt(page as string) || 1;

        let data: TopicAttributes[] = [];

        if (!rest && !q) {
            //TODO : return all topics
            data = await topicService.getAllTopics({});
        } else if (!rest && q) {
            data = await topicService.searchTopic(q as string);
        } else if (!q && rest) {
            const { order, userId, type } = rest;
            const { errors, input } = await RequestValidator(GetAllTopicReq, {
                userId,
                type,
                order,
            });
            if (errors) return res.status(400).json({ errors });

            data = await topicService.getAllTopics({
                ...(order && { order: order as 'asc' | 'desc' }),
                ...(userId && { userId: userId as string }),
                ...(type && { type: type as TopicType }),
            });
        }

        const totalItems: number = data.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = currentPage * pageSize;
        const itemsOnPage = data.slice(startIndex, endIndex);

        const pagination = {
            currentPage,
            totalPages,
            hasPreviousPage: currentPage > 1,
            hasNextPage: currentPage < totalPages,
        };

        return res.status(200).json({ data: itemsOnPage, pagination });
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
        }

        const count = await topicService.count({
            userId: userId as string,
            type: type as TopicType,
        });

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
        const {
            type: bodyType,
            startDate: bodyStartDate,
            endDate: bodyEndDate,
            eventDate: bodyEventDate,
            eventLocation: bodyEventLocation,
            ...restBody
        } = req.body;

        // Date type Parsing
        const parsedStartDate = new Date(bodyStartDate);
        const parsedEndDate = new Date(bodyEndDate);
        const parsedEventDate = new Date(bodyEventDate);

        const parsedBody = {
            type: bodyType,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            ...(bodyType === 'event' && { eventDate: parsedEventDate }),
            ...(bodyType === 'event' && { eventLocation: bodyEventLocation }),
            ...restBody,
        };

        console.log(parsedBody);

        const { errors, input } = await RequestValidator(UpdateTopicReq, parsedBody);
        if (errors) return res.status(400).json({ errors });

        const { topicId, userId, eventDate, eventLocation, description, ...rest } = input;
        const topicData = await topicService.updateTopicById(topicId, rest);

        if (topicData == 0) {
            return res.status(400).json({ message: 'Data Not Found', topicData });
        } else {
            const typeInput = {
                ...(rest.type === 'poll'
                    ? ({ topicId, description: description } as PollTopicAttributes)
                    : ({
                          topicId,
                          description: description,
                          eventDate,
                          eventLocation,
                      } as EventTopicAttributes)),
            };
            const typeData = await typeService.updateType({ type: rest.type, input: typeInput });

            const topicResult = await topicService.getTopicByTopicId(topicId);
            const typeResult = await typeService.getTypeByTopicId({
                topicId: topicId as string,
                type: rest.type,
            });

            const { id, topicId: typeTopicId, ...typeDataWithoutIds } = typeResult || {};
            const result = {
                ...topicResult,
                ...typeDataWithoutIds,
            };

            return res.status(200).json({ message: 'Data Updated Successfully', result });
        }
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

router.patch('/topic-views', async (req: Request, res: Response) => {
    try {
        const { errors, input } = await RequestValidator(UpdateTopicViewReq, req.body);
        if (errors) return res.status(400).json({ errors });

        const { topicId } = input;
        const data = await topicService.updateViews(topicId);

        return res.status(200).json({ message: 'Data Updated Successfully', data });
    } catch (error) {}
    return res.status(400).json({ error: 'Not Implemented' });
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
