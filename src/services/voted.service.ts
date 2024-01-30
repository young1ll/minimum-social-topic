import { IVotedItemRepo } from '@/interface/voted-repo.interface';
import db from '@/models';
import { VotedItemAttributes } from '@/models/votedItem.model';

export class VotedItemService {
    private _votedItemRepository: IVotedItemRepo;

    constructor({ votedItemRepo }: { votedItemRepo: IVotedItemRepo }) {
        this._votedItemRepository = votedItemRepo;
    }

    async createVotedItem(
        ids: Pick<VotedItemAttributes, 'topicId' | 'userId' | 'candidateItemId'>,
        input: Partial<Omit<VotedItemAttributes, 'id' | 'topicId' | 'userId' | 'candidateItemId'>>
    ) {
        const transaction = await db.sequelize.transaction();
        try {
            const { candidateItemId, topicId, userId } = ids;
            console.log({ ids, input });

            if (!candidateItemId) throw new Error('candidateItemId is required');
            if (!topicId) throw new Error('topicId is required');
            if (!userId) throw new Error('userId is required');
            if (!input) return null;

            const result = await this._votedItemRepository.create({
                transaction,
                ids,
                input,
            });
            await transaction.commit();

            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getVotedItemById(votedId: string): Promise<VotedItemAttributes | null> {
        try {
            if (!votedId) throw new Error('votedId is required');

            const result = await this._votedItemRepository.getVotedItemById(votedId);

            return result;
        } catch (error) {
            throw error;
        }
    }

    async getAllVotedItemByUserId(userId: string): Promise<VotedItemAttributes[] | null> {
        try {
            if (!userId) throw new Error('userId is required');

            const result = await this._votedItemRepository.getVotedItemByUserId(userId);

            return result;
        } catch (error) {
            throw error;
        }
    }

    async getVotedItemByUserIdAndTopicId(
        userId: string,
        topicID: string
    ): Promise<VotedItemAttributes | VotedItemAttributes[] | null> {
        try {
            if (!userId) throw new Error('userId is required');
            if (!topicID) throw new Error('topicID is required');

            const result = await this._votedItemRepository.getVotedItemByUserIdAndTopicId(
                userId,
                topicID
            );

            return result;
        } catch (error) {
            throw error;
        }
    }

    async countByUserId(userId: string): Promise<number> {
        try {
            if (!userId) throw new Error('userId is required');

            return await this._votedItemRepository.countVotedItemByUserId(userId);
        } catch (error) {
            throw error;
        }
    }

    async searchByTopicTitle(query: string): Promise<VotedItemAttributes[] | null> {
        try {
            if (!query) return null;

            return await this._votedItemRepository.searchVotedItemByTopicTitle(query);
        } catch (error) {
            throw error;
        }
    }

    async updateVotedItem(
        votedId: string,
        input: Partial<Omit<VotedItemAttributes, 'id'>>
    ): Promise<number> {
        const transaction = await db.sequelize.transaction();
        try {
            if (!votedId) throw new Error('votedId is required');
            if (!input) return 0;

            const result = await this._votedItemRepository.updatedVotedItem({
                transaction,
                votedId,
                input,
            });
            await transaction.commit();

            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteVotedItem(votedId: string): Promise<number> {
        const transaction = await db.sequelize.transaction();
        try {
            if (!votedId) throw new Error('votedId is required');

            const result = await this._votedItemRepository.deleteVotedItem({
                transaction,
                votedId,
            });
            await transaction.commit();

            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteVotedItems(votedIds: string[]): Promise<number> {
        const transaction = await db.sequelize.transaction();
        try {
            if (votedIds.length === 0) throw new Error('votedIds is required');

            const result = await this._votedItemRepository.deleteVotedItems({
                transaction,
                votedIds,
            });
            await transaction.commit();

            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
