import { VotedCreateReq } from '@/dto/voted.dto';
import { CandidateRepository, TopicRepository, VotedItemRepository } from '@/repository';
import { CandidateService, TopicService, VotedItemService } from '@/services';
import { RequestValidator } from '@/utils/request-validator';
import e, { Request, Response } from 'express';

const topicRepo = new TopicRepository();
const candidateRepo = new CandidateRepository();
const votedItemRepo = new VotedItemRepository();

const router = e.Router();
const topicService = new TopicService({ topicRepo });
const candidateService = new CandidateService({ candidateRepo });
const votedService = new VotedItemService({ votedItemRepo });

// POST /voted - Create a new VotedItem
// 새로운 votedItem 생성
router.post('/voted', async (req: Request, res: Response) => {
    try {
        const { candidateItemId, topicId, userId } = req.body;
        const { errors, input } = await RequestValidator(VotedCreateReq, {
            candidateItemId,
            topicId,
            userId,
        });
        if (errors) return res.status(400).json({ errors });

        const candidateData = await candidateService.getCandidateById(input.candidateItemId);
        const topicData = await topicService.getTopicByTopicId(input.topicId);

        if (!candidateData || !topicData) {
            return res.status(400).json({
                message: 'Data Not Found',
                cause: `check ${input.topicId} or ${input.candidateItemId}`,
            });
        }

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
            ...candidateRest,
            ...topicRest,
        };

        const result = await votedService.createVotedItem(resultIds, resultInput);

        return res.status(200).json({ data: result });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});
