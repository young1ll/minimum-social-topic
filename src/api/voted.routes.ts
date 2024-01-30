import { TopicType } from '@/dto/type.dto';
import { VotedCreateReq, VotedGetReq, VotedUpdateReq } from '@/dto/voted.dto';
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
 *         description: body
 *         schema:
 *           $ref: '#/definitions/CreateVotedBodyParams'
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

export default router;
