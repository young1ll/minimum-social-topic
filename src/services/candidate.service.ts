import { ICandidateRepo } from '@/interface/candidate-repo.interface';
import { ITopicRepo } from '@/interface/topic-repo.interface';
import db from '@/models';
import { CandidateItemAttributes } from '@/models/candidateItem.model';
import { Op } from 'sequelize';
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
            if (!result) throw new Error('failed to create candidate');

            await db.Topic.increment(
                { candidateItemCount: 1 },
                { where: { id: topicId }, transaction }
            );
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

            const thisCandidate = await this._candidateRepository.getCandidateItemById(candidateId);
            if (!thisCandidate) throw new Error('candidate not found');

            const result = await this._candidateRepository.deleteCandidateItem({
                transaction,
                candidateId,
            });
            if (!result) throw new Error('failed to delete candidate');

            await db.Topic.decrement(
                { candidateItemCount: 1 },
                { where: { id: thisCandidate.topicId }, transaction }
            );
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

            await db.Topic.decrement(
                { candidateItemCount: 1 },
                { where: { id: { [Op.in]: candidateIds } }, transaction }
            );
            await transaction.commit();

            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
