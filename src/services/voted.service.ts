import { IVotedItemRepo } from '@/interface/voted-repo.interface';
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
        try {
            const { candidateItemId, topicId, userId } = ids;

            if (!candidateItemId) throw new Error('candidateItemId is required');
            if (!topicId) throw new Error('topicId is required');
            if (!userId) throw new Error('userId is required');
            if (!input) return null;

            return await this._votedItemRepository.create(ids, input);
        } catch (error) {
            throw error;
        }
    }

    async getVotedItemById(votedId: string): Promise<VotedItemAttributes | null> {
        try {
            if (!votedId) throw new Error('votedId is required');

            return await this._votedItemRepository.getVotedItemById(votedId);
        } catch (error) {
            throw error;
        }
    }

    async getAllVotedItemByUserId(userId: string): Promise<VotedItemAttributes[] | null> {
        try {
            if (!userId) throw new Error('userId is required');

            return await this._votedItemRepository.getVotedItemByUserId(userId);
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

            return await this._votedItemRepository.getVotedItemByUserIdAndTopicId(userId, topicID);
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
        try {
            if (!votedId) throw new Error('votedId is required');
            if (!input) return 0;

            return await this._votedItemRepository.updatedVotedItem(votedId, input);
        } catch (error) {
            throw error;
        }
    }

    async deleteVotedItem(votedId: string): Promise<number> {
        try {
            if (!votedId) throw new Error('votedId is required');

            return await this._votedItemRepository.deleteVotedItem(votedId);
        } catch (error) {
            throw error;
        }
    }

    async deleteVotedItems(votedIds: string[]): Promise<number> {
        try {
            if (votedIds.length === 0) throw new Error('votedIds is required');

            return await this._votedItemRepository.deleteVotedItems(votedIds);
        } catch (error) {
            throw error;
        }
    }
}
