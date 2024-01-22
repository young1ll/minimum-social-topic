import db from '@/utils/dbseed';
import { DataTypes } from 'sequelize';
import { Topic } from './topic.model';

export interface EventTopicAttributes {
    topicId: string;
    content?: string;
    eventDate?: string;
    eventLocation?: string;
}

export const EventTopic = db.sequelize.define('eventTopic', {
    topicId: {
        type: DataTypes.UUID,
        references: {
            model: 'topic',
            key: 'id',
        },
    },
    content: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    eventDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    eventLocation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});
