import { DataTypes, Sequelize } from 'sequelize';
import { Topic } from './topic.model';
// import sequelize from 'sequelize';

export interface EventTopicAttributes {
    id: number;

    topicId: string;
    description: string;
    eventDate?: string;
    eventLocation?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export const EventTopic = ({ sequelize }: { sequelize: Sequelize }) => {
    return sequelize.define(
        'eventTopic',
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
            eventDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            eventLocation: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            tableName: 'event_topics',
        }
    );
};
