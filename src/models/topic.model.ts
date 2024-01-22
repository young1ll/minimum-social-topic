import db from '@/utils/dbseed';
import { DataTypes, Optional } from 'sequelize';

export interface TopicAttributes {
    id: string;
    userId: string;
    type: string; // enum
    title: string;
    status?: string; // enum
    isSecretVote?: boolean;
    castingVote?: string; // 최종 투표자 id
    resultOpen?: boolean;
    view?: number;
    startDate?: Date;
    endDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export const Topic = db.sequelize.define(
    'topic',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('poll', 'event'),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'open', 'close'),
            allowNull: false,
            defaultValue: 'pending',
        },
        isSecretVote: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        castingVote: {
            type: DataTypes.STRING, // userId
            allowNull: true,
        },
        resultOpen: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        view: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        indexes: [
            {
                type: 'FULLTEXT',
                fields: ['title'],
            },
        ],
    }
);
