import {
    CandidateCountReq,
    CandidateCreateReq,
    CandidateDeleteReq,
    CandidateUpdateReq,
} from '@/dto/candidate.dto';
import { CandidateRepository } from '@/repository/candidate.repo';
import { CandidateService } from '@/services/candidate.service';
import { RequestValidator } from '@/utils/request-validator';
import e, { Request, Response } from 'express';

const candidateRepo = new CandidateRepository();

const router = e.Router();
export const candidateService = new CandidateService({ candidateRepo });

/**
 * @swagger
 * /candidate:
 *   post:
 *     tags: [Candidate]
 *     summary: 새로운 선택지 생성하기
 *     description: body로 정보를 입력해 CREATE API를 호출합니다.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: request body로 데이터를 입력해 CREATE API를 호출합니다.
 *         schema:
 *           $ref: '#/definitions/CreateCandidateBodyParams'
 */
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

/**
 * @swagger
 * /candidate-count:
 *   get:
 *     tags: [Candidate]
 *     summary: 선택지 갯수 가져오기
 *     description: 특정 Topic의 선택지 갯수를 가져옵니다. query로 topicId, elected(선택지) 검색이 가능합니다.
 *     parameters:
 *       - in: query
 *         name: topicId
 *         required: true
 *         description: ID of the topic to filter candidates.
 *         schema:
 *           type: string
 *       - in: query
 *         name: elected
 *         required: true
 *         description: Whether the candidate is elected or not ("true" or "false").
 *         schema:
 *           type: string
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
 *                 elected:
 *                   type: string
 *               data:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: number
 */
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

/**
 * @swagger
 * /candidate:
 *   put:
 *     tags: [Candidate]
 *     summary: 선택지 수정하기
 *     description: body로 정보를 입력해 UPDATE API를 호출합니다.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: request body로 데이터를 입력해 UPDATE API를 실행합니다.
 *         schema:
 *           $ref: '#/definitions/UpdateCandidateBodyParams'
 */
router.put('/candidate', async (req: Request, res: Response) => {
    try {
        const { errors, input } = await RequestValidator(CandidateUpdateReq, req.body);
        if (errors) return res.status(400).json({ errors });

        const { id, topicId, order, detail, elected } = input;
        const data = await candidateService.updateCandidateById(id, {
            topicId,
            order,
            detail,
            elected,
        });

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
