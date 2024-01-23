import { TopicType } from '@/dto/type.dto';
import { ITopicRepo } from '@/interface/topic-repo.interface';
import db from '@/models';
import { TopicAttributes } from '@/models/topic.model';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

const Topic = db.Topic;

export class TopicRepository implements ITopicRepo {
    async create({
        userId,
        type,
        title,
        ...rest
    }: Pick<TopicAttributes, 'userId' | 'title' | 'type'> &
        Partial<TopicAttributes>): Promise<TopicAttributes> {
        const topicId = uuidv4();
        const data = await Topic.create({
            id: topicId,
            userId,
            type,
            title,
            ...rest,
        });

        return data.toJSON();
    }
    async count(userId: string, type?: TopicType): Promise<number> {
        const data = Topic.count({
            where: {
                userId,
                ...(type !== undefined && { type }),
            },
        });

        return data;
    }
    async getTopicByTopicId(topicId: string): Promise<TopicAttributes | null> {
        const data = await Topic.findOne({
            where: {
                id: topicId,
            },
        });

        return data?.toJSON() || null;
    }
    async getAllTopicsByUserId(userId: string): Promise<TopicAttributes[] | null> {
        const data = await Topic.findAll({
            where: {
                userId,
            },
        });

        return data?.map((topic) => topic.toJSON()) || null;
    }
    async searchTopic(query: string): Promise<TopicAttributes[] | null> {
        const data = await Topic.findAll({
            where: Sequelize.literal(`(
                title COLLATE utf8mb4_general_ci LIKE '%${query}%'
            )`),
        });

        return data?.map((topic) => topic.toJSON()) || null;
        // throw new Error('Method not implemented.');
    }
    async updateTopicById(id: string, topic: Partial<TopicAttributes>): Promise<number> {
        const data = await Topic.update(topic, {
            where: {
                id,
            },
        });

        return Promise.resolve(data[0]);
    }
    async deleteTopicById(id: string): Promise<number> {
        const data = await Topic.destroy({
            where: {
                id,
            },
        });

        return data;
    }

    async deleteTopicsById(id: string[]): Promise<number> {
        const data = await Topic.destroy({
            where: {
                id: { [Op.in]: id },
            },
        });

        return data;
    }
}
