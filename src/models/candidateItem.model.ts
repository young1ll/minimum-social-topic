import db from '@/utils/dbseed';
import { DataTypes } from 'sequelize';
import { Topic } from './topic.model';

export interface CandidateItemAttributes {
    id: string;
    topicId: string;
    content?: string;
}

export const CandidateItem = db.sequelize.define('candidateItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
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
    elelcted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});
