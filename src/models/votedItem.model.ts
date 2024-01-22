import db from '@/utils/dbseed';
import { DataTypes } from 'sequelize';
import { Topic } from './topic.model';

export interface VotedItemAttributes {
    userId: string;
    candidateItemId: string;
    createdAt: string;
}

export const VotedItem = db.sequelize.define('votedItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING,
        references: {
            model: 'user',
            key: 'id',
        },
    },
    topicId: {
        type: DataTypes.UUID,
        references: {
            model: 'topic',
            key: 'id',
        },
    },
    candidateItemId: {
        type: DataTypes.UUID,
        references: {
            model: 'candidateItem',
            key: 'id',
        },
    },

    topicTitle: {
        type: DataTypes.STRING,
        references: {
            model: Topic,
            key: 'title',
        },
    },
    topicCastingVote: {
        type: DataTypes.STRING,
        references: {
            model: Topic,
            key: 'castingVote',
        },
    },
    topicResultOpen: {
        type: DataTypes.BOOLEAN,
        references: {
            model: Topic,
            key: 'resultOpen',
        },
    },
    topicStartDate: {
        type: DataTypes.DATE,
        references: {
            model: Topic,
            key: 'startDate',
        },
    },
    topicEndDate: {
        type: DataTypes.DATE,
        references: {
            model: Topic,
            key: 'endDate',
        },
    },
    topicCreatedAt: {
        type: DataTypes.DATE,
        references: {
            model: Topic,
            key: 'createdAt',
        },
    },

    candidateContent: {
        type: DataTypes.STRING,
        references: {
            model: 'candidateItem',
            key: 'content',
        },
    },
    candidateElected: {
        type: DataTypes.BOOLEAN,
        references: {
            model: 'candidateItem',
            key: 'elelcted',
        },
    },
});
