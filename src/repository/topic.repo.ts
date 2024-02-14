import { TopicType } from '@/dto/type.dto';
import { ITopicRepo } from '@/interface/topic-repo.interface';
import db from '@/models';
import { TopicAttributes } from '@/models/topic.model';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

const Topic = db.Topic;

export class TopicRepository implements ITopicRepo {
    async create({
        transaction,
        input: { userId, type, title, ...rest },
    }: {
        transaction: Transaction;
        input: Pick<TopicAttributes, 'userId' | 'title' | 'type'> & Partial<TopicAttributes>;
    }): Promise<TopicAttributes> {
        const topicId = uuidv4();
        const data = await Topic.create(
            {
                id: topicId,
                userId,
                type,
                title,
                ...rest,
            },
            { transaction }
        );

        return data.toJSON();
    }
    async countByUserId(userId: string, type?: TopicType): Promise<number> {
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

    async getAll(
        order?: 'asc' | 'desc', //order
        userId?: string, // filter
        type?: TopicType // filter
    ): Promise<TopicAttributes[] | []> {
        const data = await Topic.findAll({
            order: [['createdAt', order || 'desc']],
            where: {
                ...(type && { type }),
                ...(userId && { userId }),
            },
        });

        return data?.map((topic) => topic.toJSON());
    }

    async searchTopic(query: string): Promise<TopicAttributes[] | []> {
        const data = await Topic.findAll({
            where: Sequelize.literal(`(
                title COLLATE utf8mb4_general_ci LIKE '%${query}%'
            )`),
        });

        return data?.map((topic) => topic.toJSON());
        // throw new Error('Method not implemented.');
    }
    async updateTopicById({
        transaction,
        id,
        topic,
    }: {
        transaction: Transaction;
        id: string;
        topic: Partial<TopicAttributes>;
    }): Promise<number> {
        const data = await Topic.update(topic, {
            where: {
                id,
            },
            transaction,
        });

        return Promise.resolve(data[0]);
    }

    async updateViewsByTopicId({
        transaction,
        id,
    }: {
        transaction: Transaction;
        id: string;
    }): Promise<number> {
        const [affectedRows] = await Topic.update(
            {
                view: Sequelize.literal('view + 1'),
            },
            {
                where: {
                    id,
                },
                transaction,
            }
        );

        return affectedRows;
    }

    async deleteTopicById({
        transaction,
        id,
    }: {
        transaction: Transaction;
        id: string;
    }): Promise<number> {
        const data = await Topic.destroy({
            where: {
                id,
            },
            transaction,
        });

        return data;
    }

    async deleteTopicsById({
        transaction,
        ids,
    }: {
        transaction: Transaction;
        ids: string[];
    }): Promise<number> {
        const data = await Topic.destroy({
            where: {
                id: { [Op.in]: ids },
            },
            transaction,
        });

        return data;
    }
}
