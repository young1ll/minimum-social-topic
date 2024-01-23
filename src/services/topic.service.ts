import { TopicType } from '@/dto/type.dto';
import { ITopicRepo } from '@/interface/topic-repo.interface';
import { TopicAttributes } from '@/models/topic.model';

interface CreateTopicReq
    extends Pick<TopicAttributes, 'userId' | 'title' | 'type'>,
        Partial<Omit<TopicAttributes, 'userId' | 'title' | 'type'>> {}

export class TopicService {
    private _topicRepository: ITopicRepo;

    constructor({ topicRepo }: { topicRepo: ITopicRepo }) {
        this._topicRepository = topicRepo;
    }

    async createTopic(input: CreateTopicReq): Promise<TopicAttributes> {
        try {
            const { userId, title, type, ...rest } = input;
            // NOTE: content는 TypeAttributes

            if (!userId) throw new Error('userId is required');
            if (!title) throw new Error('title is required');
            if (!type) throw new Error('type is required');

            const topicData = await this._topicRepository.create({ userId, title, type, ...rest });

            return topicData;
        } catch (error) {
            throw error;
        }
    }

    async getTopicByTopicId(topicId: string): Promise<TopicAttributes | null> {
        try {
            if (!topicId) throw new Error('topicId is required');

            return await this._topicRepository.getTopicByTopicId(topicId);
        } catch (error) {
            throw error;
        }
    }

    // TODO: topicId 배열로 topic Data 반환하기
    // eg: 여러 데이터 삭제 시 해당 데이터 존재 여부 확인
    async getAllTopicsByTopicIds(topicIds: string[]) {}

    async getAllTopicsByUserId(userId: string): Promise<TopicAttributes[] | null> {
        try {
            if (!userId) throw new Error('userId is required');

            return await this._topicRepository.getAllTopicsByUserId(userId);
        } catch (error) {
            throw error;
        }
    }

    async searchTopic(query: string): Promise<TopicAttributes[] | null> {
        try {
            if (!query) return null;
            return await this._topicRepository.searchTopic(query);
        } catch (error) {
            throw error;
        }
    }

    async count(userId: string, type?: TopicType): Promise<number> {
        try {
            if (!userId) throw new Error('userId is required');

            return await this._topicRepository.count(userId, type);
        } catch (error) {
            throw error;
        }
    }

    async updateTopicById(topicId: string, topic: Partial<TopicAttributes>): Promise<number> {
        try {
            if (!topicId) throw new Error('id is required');
            if (!topic) return 0;

            return await this._topicRepository.updateTopicById(topicId, topic);
        } catch (error) {
            throw error;
        }
    }

    async deleteTopicById(topicId: string): Promise<number> {
        try {
            if (!topicId) throw new Error('id is required');

            return await this._topicRepository.deleteTopicById(topicId);
        } catch (error) {
            throw error;
        }
    }

    async deleteTopicsById(topicIds: string[]): Promise<number> {
        try {
            if (topicIds.length === 0) throw new Error('id is required');

            return await this._topicRepository.deleteTopicsById(topicIds);
        } catch (error) {
            throw error;
        }
    }
}
