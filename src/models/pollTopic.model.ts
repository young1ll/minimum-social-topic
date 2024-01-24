import { DataTypes, Sequelize } from 'sequelize';
import { Topic } from './topic.model';

export interface PollTopicAttributes {
    id: number;

    topicId: string;
    description: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export const PollTopic = ({ sequelize }: { sequelize: Sequelize }) => {
    return sequelize.define(
        'pollTopic',
        {
            // topicId: {
            //     type: DataTypes.UUID,
            //     references: {
            //         model: Topic({ sequelize }),
            //         key: 'id',
            //     },
            // },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'poll_topics',
        }
    );
};
