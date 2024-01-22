import db from '@/utils/dbseed';
import { DataTypes } from 'sequelize';
import { Topic } from './topic.model';

export interface PollTopicAttributes {
    topicId: string;
    content?: string;
}

export const PollTopic = db.sequelize.define('pollTopic', {
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
});
