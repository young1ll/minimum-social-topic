import { IVotedItemRepo } from '@/interface/voted-repo.interface';
import db from '@/models';
import { VotedItemAttributes } from '@/models/votedItem.model';
import { Op, Sequelize } from 'sequelize';

const VotedItem = db.VotedItem;

export class VotedItemRepository implements IVotedItemRepo {
    async create(
        ids: Pick<VotedItemAttributes, 'topicId' | 'userId' | 'candidateItemId'>,
        input: Partial<Omit<VotedItemAttributes, 'id' | 'topicId' | 'userId' | 'candidateItemId'>>
    ): Promise<VotedItemAttributes> {
        const data = await VotedItem.create({
            ...ids,
            ...input,
        });

        return data.toJSON();
    }
    async getVotedItemById(votedId: string): Promise<VotedItemAttributes | null> {
        const data = await VotedItem.findOne({
            where: {
                id: votedId,
            },
        });

        return data?.toJSON() || null;
    }
    async getVotedItemByUserId(userId: string): Promise<VotedItemAttributes[] | null> {
        const data = await VotedItem.findAll({
            where: {
                userId,
            },
        });

        return data?.map((d) => d.toJSON()) || null;
    }
    async getVotedItemByUserIdAndTopicId(
        userId: string,
        topicID: string
    ): Promise<VotedItemAttributes | VotedItemAttributes[] | null> {
        const data = await VotedItem.findAll({
            where: {
                userId,
            },
        });

        return data?.map((d) => d.toJSON()) || null;
    }

    async countVotedItemByUserId(userId: string): Promise<number> {
        const data = await VotedItem.count({
            where: {
                userId,
            },
        });

        return data;
    }

    async searchVotedItemByTopicTitle(query: string): Promise<VotedItemAttributes[] | null> {
        const data = await VotedItem.findAll({
            where: Sequelize.literal(`(
            topicTitle COLLATE utf8mb4_general_ci LIKE '%${query}%'
        )`),
        });

        return data?.map((d) => d.toJSON()) || null;
    }

    async updatedVotedItem(
        votedId: string,
        input: Partial<Omit<VotedItemAttributes, 'id'>>
    ): Promise<number> {
        const data = await VotedItem.update(input, {
            where: {
                id: votedId,
            },
        });

        return data[0];
    }
    async deleteVotedItem(votedId: string): Promise<number> {
        const data = await VotedItem.destroy({
            where: {
                id: votedId,
            },
        });

        return data;
    }

    async deleteVotedItems(votedIds: string[]): Promise<number> {
        const data = await VotedItem.destroy({
            where: {
                id: { [Op.in]: votedIds },
            },
        });

        return data;
    }
}
