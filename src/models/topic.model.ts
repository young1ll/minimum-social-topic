import { DataTypes, Sequelize } from 'sequelize';
import User from './lagacy-tables/user.model';

export interface TopicAttributes {
    id: string;
    userId: string;
    title: string;
    type: string; // enum
    status?: string; // enum
    isPlurality?: boolean; // 복수 투표
    isSecretVote?: boolean; // 비밀 투표 여부
    castingVote?: string; // 최종 투표자 id
    resultOpen?: boolean;
    view?: number;
    startDate?: Date;
    endDate?: Date;

    createdAt?: Date;
    updatedAt?: Date;
}

export const Topic = ({ sequelize }: { sequelize: Sequelize }) => {
    return sequelize.define(
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
                    model: User({ sequelize }),
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
            isPlurality: {
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
            // 비정규화 컬럼
            candidateItemCount: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
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
            tableName: 'topics',
            indexes: [
                {
                    type: 'FULLTEXT',
                    fields: ['title'],
                },
            ],
            paranoid: true,
        }
    );
};
