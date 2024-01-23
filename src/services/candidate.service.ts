import { ICandidateRepo } from '@/interface/candidate-repo.interface';
import { CandidateItemAttributes } from '@/models/candidateItem.model';

export class CandidateService {
    private _candidateRepository: ICandidateRepo;

    constructor({ candidateRepo }: { candidateRepo: ICandidateRepo }) {
        this._candidateRepository = candidateRepo;
    }

    async create(input: CandidateItemAttributes): Promise<CandidateItemAttributes> {
        try {
            const { id, topicId, order, detail } = input;
            if (!id) throw new Error('id is required');
            if (!topicId) throw new Error('topicId is required');
            if (!order) throw new Error('order is required');

            const data = await this._candidateRepository.create({ id, topicId, order, detail });

            return data;
        } catch (error) {
            throw error;
        }
    }

    async getCandidateById(candidateId: string): Promise<CandidateItemAttributes | null> {
        try {
            if (!candidateId) throw new Error('id is required');

            return await this._candidateRepository.getCandidateItemById(candidateId);
        } catch (error) {
            throw error;
        }
    }

    async getAllCandidatesByTopicId(topicId: string): Promise<CandidateItemAttributes | null> {
        try {
            if (!topicId) throw new Error('topicId is required');

            return await this._candidateRepository.getCandidateItemByTopicId(topicId);
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<CandidateItemAttributes[] | null> {
        try {
            return await this._candidateRepository.getAllCandidateItems();
        } catch (error) {
            throw error;
        }
    }

    async count(topicId?: string, elected?: string): Promise<number> {
        try {
            if (topicId && !elected) {
                return await this._candidateRepository.count(topicId);
            } else if (topicId && elected) {
                return await this._candidateRepository.count(topicId, elected === 'true');
            }
            return await this._candidateRepository.count();
        } catch (error) {
            throw error;
        }
    }

    async updateCandidateById(
        candidateId: string,
        input: Partial<Omit<CandidateItemAttributes, 'id'>>
    ): Promise<number> {
        try {
            if (!candidateId) throw new Error('id is required');
            if (!input) return 0;

            return await this._candidateRepository.updateCandidateItem({ id: candidateId }, input);
        } catch (error) {
            throw error;
        }
    }

    async deleteCandidateById(candidateId: string): Promise<number> {
        try {
            if (!candidateId) throw new Error('id is required');

            return await this._candidateRepository.deleteCandidateItem({ id: candidateId });
        } catch (error) {
            throw error;
        }
    }

    async deleteCandidatesByIds(candidateIds: string[]): Promise<number> {
        try {
            if (candidateIds.length === 0) throw new Error('id is required');

            return await this._candidateRepository.deleteCandidatesByIds(candidateIds);
        } catch (error) {
            throw error;
        }
    }
}
