import { ICandidateRepo } from '@/interface/candidate-repo.interface';
import db from '@/models';
import { CandidateItemAttributes } from '@/models/candidateItem.model';
import { Transaction } from 'sequelize';

export class CandidateService {
    private _candidateRepository: ICandidateRepo;

    constructor({ candidateRepo }: { candidateRepo: ICandidateRepo }) {
        this._candidateRepository = candidateRepo;
    }

    async create(input: Omit<CandidateItemAttributes, 'id'>): Promise<CandidateItemAttributes> {
        const transaction = await db.sequelize.transaction();
        try {
            const { topicId, order, detail } = input;
            if (!topicId) throw new Error('topicId is required');
            if (!order) throw new Error('order is required(order cannot be 0)');
            if (!detail) throw new Error('detail is required');

            const result = await this._candidateRepository.create({
                transaction,
                input: { topicId, order, detail },
            });
            await transaction.commit();
            // const data = Promise.resolve({ id: 1, ...(input as any) });

            return result;
        } catch (error) {
            await transaction.rollback();
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

    async getAllCandidatesByTopicId(topicId: string): Promise<CandidateItemAttributes[] | null> {
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
        const transaction = await db.sequelize.transaction();
        try {
            if (!candidateId) throw new Error('id is required');
            if (!input) return 0;

            const result = await this._candidateRepository.updateCandidateItem({
                transaction,
                candidateId,
                input,
            });
            await transaction.commit();

            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteCandidateById(candidateId: string): Promise<number> {
        const transaction = await db.sequelize.transaction();
        try {
            if (!candidateId) throw new Error('id is required');

            const result = await this._candidateRepository.deleteCandidateItem({
                transaction,
                candidateId,
            });
            await transaction.commit();

            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteCandidatesByIds(candidateIds: string[]): Promise<number> {
        const transaction = await db.sequelize.transaction();
        try {
            if (candidateIds.length === 0) throw new Error('id is required');

            const result = await this._candidateRepository.deleteCandidatesByIds({
                transaction,
                candidateIds,
            });
            await transaction.commit();

            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
