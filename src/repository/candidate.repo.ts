import { ICandidateRepo } from '@/interface/candidate-repo.interface';
import db from '@/models';
import { CandidateItemAttributes } from '@/models/candidateItem.model';
import { Op } from 'sequelize';

const CandidateItem = db.CandidateItem;

export class CandidateRepository implements ICandidateRepo {
    async create(input: Omit<CandidateItemAttributes, 'id'>): Promise<CandidateItemAttributes> {
        // const data = Promise.resolve(input as any);
        const data = await CandidateItem.create({
            ...input,
        });

        // return data;
        return data.toJSON();
    }
    async getCandidateItemById(candidateId: string): Promise<CandidateItemAttributes | null> {
        const data = await CandidateItem.findOne({
            where: {
                id: candidateId,
            },
        });

        return data?.toJSON() || null;
    }
    async getCandidateItemByTopicId(topicId: string): Promise<CandidateItemAttributes[] | null> {
        const data = await CandidateItem.findAll({
            where: {
                topicId,
            },
        });

        return data?.map((candidate) => candidate.toJSON()) || null;
    }

    async getAllCandidateItems(): Promise<CandidateItemAttributes[] | null> {
        const data = await CandidateItem.findAll();

        return data?.map((candidate) => candidate.toJSON()) || null;
    }

    async count(topicId?: string, elected?: boolean): Promise<number> {
        const data = await CandidateItem.count({
            where: {
                ...(topicId !== undefined && { topicId }),
                ...(elected !== undefined && { elected }),
            },
        });

        return data;
    }

    async updateCandidateItem(
        candidateId: string,
        input: Partial<Omit<CandidateItemAttributes, 'id'>>
    ): Promise<number> {
        const data = await CandidateItem.update(input, {
            where: {
                id: candidateId,
            },
        });

        return data[0];
    }
    async deleteCandidateItem(candidateId: string): Promise<number> {
        const data = await CandidateItem.destroy({
            where: {
                id: candidateId,
            },
        });

        return data;
    }

    async deleteCandidatesByIds(candidateIds: string[]): Promise<number> {
        const data = await CandidateItem.destroy({
            where: {
                id: { [Op.in]: candidateIds },
            },
        });

        return data;
    }
}
