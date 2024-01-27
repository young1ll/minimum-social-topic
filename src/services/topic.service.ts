import { TopicType } from '@/dto/type.dto';
import { ITopicRepo } from '@/interface/topic-repo.interface';
import db from '@/models';
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
        const transaction = await db.sequelize.transaction();

        try {
            const { userId, title, type, ...rest } = input;
            // NOTE: content는 TypeAttributes

            if (!userId) throw new Error('userId is required');
            if (!title) throw new Error('title is required');
            if (!type) throw new Error('type is required');

            const result = await this._topicRepository.create({
                transaction,
                input: { userId, title, type, ...rest },
            });
            await transaction.commit();

            return result;
        } catch (error) {
            await transaction.rollback();
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

    async getAllTopics({
        order,
        userId,
        type,
    }: {
        order?: 'asc' | 'desc';
        userId?: string;
        type?: TopicType;
    }): Promise<TopicAttributes[] | []> {
        try {
            return await this._topicRepository.getAll(order, userId, type);
        } catch (error) {
            throw error;
        }
    }

    // TODO: topicId 배열로 topic Data 반환하기
    // eg: 여러 데이터 삭제 시 해당 데이터 존재 여부 확인
    async getAllTopicsByTopicIds(topicIds: string[]) {}

    async searchTopic(query: string): Promise<TopicAttributes[] | []> {
        try {
            if (!query) return [];
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
        const transaction = await db.sequelize.transaction();
        try {
            if (!topicId) throw new Error('id is required');
            if (!topic) return 0;

            const result = await this._topicRepository.updateTopicById({
                transaction,
                id: topicId,
                topic,
            });
            await transaction.commit();

            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateViews(topicId: string): Promise<number> {
        const transaction = await db.sequelize.transaction();
        try {
            if (!topicId) throw new Error('id is required');

            const result = await this._topicRepository.updateViewsByTopicId({
                transaction,
                id: topicId,
            });
            await transaction.commit();

            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteTopicById(topicId: string): Promise<number> {
        const transaction = await db.sequelize.transaction();
        try {
            if (!topicId) throw new Error('id is required');

            const result = await this._topicRepository.deleteTopicById({
                transaction,
                id: topicId,
            });
            await transaction.commit();

            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteTopicsById(topicIds: string[]): Promise<number> {
        const transaction = await db.sequelize.transaction();
        try {
            if (topicIds.length === 0) throw new Error('id is required');

            const result = await this._topicRepository.deleteTopicsById({
                transaction,
                ids: topicIds,
            });
            await transaction.commit();

            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
