import { CandidateCountReq } from '@/dto/candidate.dto';
import { CandidateRepository } from '@/repository/candidate.repo';
import { CandidateService } from '@/services/candidate.service';
import { RequestValidator } from '@/utils/request-validator';
import e, { Request, Response } from 'express';

const candidateRepo = new CandidateRepository();

const router = e.Router();
export const candidateService = new CandidateService({ candidateRepo });

//
router.get('/candidate-count', async (req: Request, res: Response) => {
    try {
        const { topicId, elected } = req.query;
        const { errors, input } = await RequestValidator(CandidateCountReq, {
            topicId: topicId as string,
            elected: elected as string,
        });
        if (errors) return res.status(400).json({ errors });

        const data = await candidateService.count(input.topicId, input.elected);

        return res.status(200).json({ input: input, data: data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

export default router;
