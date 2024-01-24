import { CandidateCountReq, CandidateCreateReq, CandidateDeleteReq } from '@/dto/candidate.dto';
import { CandidateRepository } from '@/repository/candidate.repo';
import { CandidateService } from '@/services/candidate.service';
import { RequestValidator } from '@/utils/request-validator';
import e, { Request, Response } from 'express';

const candidateRepo = new CandidateRepository();

const router = e.Router();
export const candidateService = new CandidateService({ candidateRepo });

// POST /candidate - Create a new Candidate
// 새로운 votedItem 생성
// id, topicId, order, detail 필요
// elected: true/false (선정여부)는 기본값 false
router.post('/candidate', async (req: Request, res: Response) => {
    try {
        const { errors, input } = await RequestValidator(CandidateCreateReq, req.body);
        if (errors) return res.status(400).json({ errors });

        const { topicId, order, detail } = input;
        const data = await candidateService.create({ topicId, order, detail });

        return res.status(200).json({ message: 'Data Created Successfully', data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

// GET /candidate-count - Get candidate count
router.get('/candidate-count', async (req: Request, res: Response) => {
    try {
        const { topicId, elected } = req.query;
        const { errors, input } = await RequestValidator(CandidateCountReq, {
            topicId: topicId as string,
            elected: elected as string,
        });
        if (errors) return res.status(400).json({ errors });

        const data = await candidateService.count(input.topicId, input.elected);

        return res.status(200).json({ query: input, data: data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

router.delete('/candidate', async (req: Request, res: Response) => {
    try {
        const { candidateId } = req.body;
        const { errors, input } = await RequestValidator(CandidateDeleteReq, {
            candidateId,
        });
        if (errors) return res.status(400).json({ errors });

        const data = await candidateService.deleteCandidateById(input.candidateId);

        return res.status(200).json({ message: 'Data Deleted Successfully', data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

export default router;
