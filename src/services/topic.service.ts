import { ITopicRepo } from '@/interface/topic-repo.interface';
import { TopicAttributes } from '@/models/topic.model';

export class TopicService {
    private _repository: ITopicRepo;

    constructor(repository: ITopicRepo) {
        this._repository = repository;
    }

    async createTopic(
        input: Pick<TopicAttributes, 'userId' | 'title' | 'type'> & Partial<TopicAttributes>
    ): Promise<TopicAttributes> {
        try {
            const { userId, title, type, ...rest } = input;

            if (!userId) throw new Error('userId is required');
            if (!title) throw new Error('title is required');
            if (!type) throw new Error('type is required');

            return await this._repository.create({ userId, title, type, ...rest });
        } catch (error) {
            throw error;
        }
    }

    async getTopicByUserIdAndId(userId: string, topicId: string): Promise<TopicAttributes | null> {
        try {
            if (!userId) throw new Error('userId is required');
            if (!topicId) throw new Error('topicId is required');

            return await this._repository.getTopicByUserIdAndId(userId, topicId);
        } catch (error) {
            throw error;
        }
    }

    async getAllTopicsByUserId(userId: string): Promise<TopicAttributes[] | null> {
        try {
            if (!userId) throw new Error('userId is required');

            return await this._repository.getAllTopicsByUserId(userId);
        } catch (error) {
            throw error;
        }
    }

    async searchTopic(query: string): Promise<TopicAttributes[] | null> {
        try {
            if (!query) return null;
            return await this._repository.searchTopic(query);
        } catch (error) {
            throw error;
        }
    }

    async count(userId: string): Promise<number> {
        try {
            if (!userId) throw new Error('userId is required');

            return await this._repository.count(userId);
        } catch (error) {
            throw error;
        }
    }

    async updateTopicById(id: string, topic: Partial<TopicAttributes>): Promise<number> {
        try {
            if (!id) throw new Error('id is required');
            if (!topic) return 0;

            return await this._repository.updateTopicById(id, topic);
        } catch (error) {
            throw error;
        }
    }

    async deleteTopicById(id: string): Promise<number> {
        try {
            if (!id) throw new Error('id is required');

            return await this._repository.deleteTopicById(id);
        } catch (error) {
            throw error;
        }
    }
}
