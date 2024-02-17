import { TopicType } from '@/dto/type.dto';
import {
    VotedCreateReq,
    VotedDeleteReq,
    VotedGetQuery,
    VotedGetReq,
    VotedUpdateReq,
} from '@/dto/voted.dto';
import {
    CandidateRepository,
    EventRepository,
    PollRepository,
    TopicRepository,
    VotedItemRepository,
} from '@/repository';
import { CandidateService, TopicService, TypeService, VotedItemService } from '@/services';
import { RequestValidator } from '@/utils/request-validator';
import e, { Request, Response } from 'express';

const topicRepo = new TopicRepository();
const eventRepo = new EventRepository();
const pollRepo = new PollRepository();

const candidateRepo = new CandidateRepository();
const votedItemRepo = new VotedItemRepository();

const router = e.Router();
const topicService = new TopicService({ topicRepo });
const typeService = new TypeService({ eventRepo, pollRepo });
const candidateService = new CandidateService({ candidateRepo });
const votedService = new VotedItemService({ votedItemRepo });

/**
 * @swagger
 * /voted:
 *   post:
 *     tags: [Voted]
 *     summary: CREATE VOTED ITEM
 *     description: 사용자의 votedItem 생성
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: votedItem 생성
 *         schema:
 *           $ref: '#/definitions/CreateVotedBodyParams'
 *     responses:
 *       200:
 *         description: Successful response with created votedItem.
 *         schema:
 *           $ref: '#/definitions/CreateVotedSuccessResponse'
 */
router.post('/voted', async (req: Request, res: Response) => {
    try {
        const { candidateItemId, topicId, userId } = req.body;
        const { errors, input } = await RequestValidator(VotedCreateReq, {
            candidateItemId,
            topicId,
            userId,
        });
        if (errors) return res.status(400).json({ errors });

        const topicData = await topicService.getTopicByTopicId(input.topicId);
        const candidateData = await candidateService.getCandidateById(input.candidateItemId);

        if (!candidateData || !topicData) {
            return res.status(400).json({
                message: 'Data Not Found',
                cause: `check ${input.topicId} or ${input.candidateItemId}`,
            });
        }

        const typeData = await typeService.getTypeByTopicId({
            topicId: input.topicId,
            type: topicData.type as TopicType,
        });

        const {
            id: candidateDataId,
            topicId: candidTopicId,
            createdAt: candidateCreatedAt,
            updatedAt: candidateUpdatedAt,
            ...candidateRest
        } = candidateData;
        const {
            id: topicDataId,
            userId: topicOwnerId,
            view,
            updatedAt: topicUpdatedAt,
            ...topicRest
        } = topicData;

        const resultIds = {
            candidateItemId: candidateDataId,
            topicId: topicDataId,
            userId: input.userId,
        };
        const resultInput = {
            topicTitle: topicRest.title,
            topicType: topicRest.type,
            topicStatus: topicRest.status,

            topicDescription: typeData?.description,

            topicIsMultiChoice: topicRest.isMultiChoice,
            topicIsSecretVote: topicRest.isSecretVote,
            topicCastingVote: topicRest.castingVote,
            topicResultOpen: topicRest.resultOpen,
            topicStartDate: topicRest.startDate,
            topicEndDate: topicRest.endDate,
            topicCreatedAt: topicRest.createdAt,

            candidateDetail: candidateRest.detail,
            candidtateOrder: candidateRest.order,
            candidateElected: candidateRest.elected,
        };

        const result = await votedService.createVotedItem(resultIds, resultInput);

        return res.status(200).json({ data: result });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /voted:
 *   get:
 *     tags: [Voted]
 *     summary: GET VOTED ITEM(단일 또는 배열)
 *     description: topicId, userId로 votedItem 가져오기
 *     parameters:
 *       - in: query
 *         name: topicId
 *         required: true
 *         description: ID of the topic to filter candidates.
 *         type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         description: ID of the user to filter candidates.
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response with query and data.
 *         schema:
 *           $ref: '#/definitions/CreateVotedSuccessResponse'
 */
router.get('/voted', async (req: Request, res: Response) => {
    try {
        const { topicId, userId } = req.query;

        const { errors, input } = await RequestValidator(VotedGetReq, {
            topicId,
            userId,
        });
        if (errors) return res.status(400).json({ errors });

        const data = await votedService.getVotedItemByUserIdAndTopicId(
            input.userId as string,
            input.topicId as string
        );

        return res.status(200).json({ query: input, data: data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /voted-count:
 *   get:
 *     tags: [Voted]
 *     summary: GET VOTED ITEM COUNT
 *     description: topicId, userId로 votedItem 갯수 가져오기
 *     parameters:
 *       - in: query
 *         name: topicId
 *         required: true
 *         description: ID of the topic to filter candidates.
 *         type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         description: ID of the user to filter candidates.
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response with query and data.
 *         schema:
 *           type: object
 *           properties:
 *             query:
 *               type: object
 *               properties:
 *                 topicId:
 *                   type: string
 *                 userId:
 *                   type: string
 *             data:
 *               type: number
 */
router.get('voted-count', async (req: Request, res: Response) => {
    try {
        const { topicId, userId } = req.query;

        const { errors, input } = await RequestValidator(VotedGetQuery, {
            topicId,
            userId,
        });
        if (errors) return res.status(400).json({ errors });

        if (input.topicId && !input.userId) {
            const data = await votedService.countByTopicId(input.topicId as string);
            return res.status(200).json({ query: input, data: data });
        } else if (!input.topicId && input.userId) {
            const data = await votedService.countByUserId(input.userId as string);
            return res.status(200).json({ query: input, data: data });
        }
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /voted:
 *   put:
 *     tags: [Voted]
 *     summary: VOTED ITEM 수정
 *     description: topicId, userId로 votedItem 변경
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CreateVotedBodyParams'
 *     responses:
 *       200:
 *         description: Successful response with updated data.
 *         schema:
 *           $ref: '#/definitions/CreateVotedSuccessResponse'
 */
router.put('/voted', async (req: Request, res: Response) => {
    try {
        const { errors, input } = await RequestValidator(VotedUpdateReq, req.body);
        if (errors) return res.status(400).json({ errors });

        const votedId = input.votedId;
        const candidateData = await candidateService.getCandidateById(input.candidateItemId);
        if (!candidateData) {
            return res.status(400).json({
                message: 'Data Not Found',
                cause: `check ${input.candidateItemId}`,
            });
        }

        const updateInput = {
            candidateDetail: candidateData.detail,
            candidtateOrder: candidateData.order,
            candidateElected: candidateData.elected,
        };

        const data = await votedService.updateVotedItem(votedId, updateInput);
        return res.status(200).json({ data: data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /voted:
 *   delete:
 *     tags: [Voted]
 *     summary: VOTED ITEM 삭제
 *     description: votedId로 votedItem 삭제
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             votedId:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful response with deleted data.
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Data Deleted Successfully
 *                 deleted:
 *                   type: number
 *                   description: 1
 */
router.delete('/voted', async (req: Request, res: Response) => {
    try {
        const { errors, input } = await RequestValidator(VotedDeleteReq, req.body);
        if (errors) return res.status(400).json({ errors });

        const data = await votedService.deleteVotedItem(input.votedId);
        return res.status(200).json({ message: 'Data Deleted Successfully', data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

export default router;
