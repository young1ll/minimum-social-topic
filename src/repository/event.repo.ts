import { IEventRepo } from '@/interface/event-repo.interface';
import db from '@/models';
import { EventTopicAttributes } from '@/models/eventTopic.model';
import { Sequelize } from 'sequelize';

const EventTopic = db.EventTopic;

export class EventRepository implements IEventRepo {
    async create(
        input: Pick<EventTopicAttributes, 'topicId'> & Partial<EventTopicAttributes>
    ): Promise<EventTopicAttributes> {
        const { topicId, content, eventDate, eventLocation } = input;
        const data = await EventTopic.create({ topicId, content, eventDate, eventLocation });

        return data.toJSON();
    }
    async getEventByTopicId(
        topicId: Pick<EventTopicAttributes, 'topicId'> | string
    ): Promise<EventTopicAttributes | null> {
        const data = await EventTopic.findOne({
            where: {
                topicId,
            },
        });

        return data?.toJSON() || null;
    }
    async getAllEvents(): Promise<EventTopicAttributes[] | null> {
        const data = await EventTopic.findAll();

        return data?.map((event) => event.toJSON()) || null;
    }
    async searchEvent(query: string): Promise<EventTopicAttributes[]> {
        const data = await EventTopic.findAll({
            where: Sequelize.literal(`(
                content COLLATE utf8mb4_general_ci LIKE '%${query}%'
            )`),
        });

        return data?.map((event) => event.toJSON()) || [];
    }
    async updateEvent(
        topicId: Pick<EventTopicAttributes, 'topicId'> | string,
        event: Partial<EventTopicAttributes>
    ): Promise<number> {
        const data = await EventTopic.update(event, {
            where: {
                topicId,
            },
        });

        return data[0];
    }
    async deleteEvent(topicId: Pick<EventTopicAttributes, 'topicId'> | string): Promise<number> {
        const data = await EventTopic.destroy({
            where: {
                topicId,
            },
        });

        return data;
    }
}
