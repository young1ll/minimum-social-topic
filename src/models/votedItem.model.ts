import { DataTypes, Sequelize } from 'sequelize';
import User from './lagacy-tables/user.model';
import { CandidateItem } from './candidateItem.model';
import { Topic } from './topic.model';

export interface VotedItemAttributes {
    id: string;
    topicId: string;
    userId: string;
    candidateItemId: string;

    topicTitle: string;
    topicType: string; // enum
    topicStatus: string; // enum
    topicIsPlurality: boolean;
    topicIsSecretVote: boolean;
    topicCastingVote?: string;
    topicResultOpen: boolean;
    topicStartDate?: Date;
    topicEndDate?: Date;
    topicCreatedAt: Date;

    candidateDetail?: string;
    candidtateOrder: number;
    candidateElected: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export const VotedItem = ({ sequelize }: { sequelize: Sequelize }) => {
    return sequelize.define(
        'votedItem',
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
            // topicId: {
            //     type: DataTypes.UUID,
            //     allowNull: false,
            //     references: {
            //         model: Topic({ sequelize }),
            //         key: 'id',
            //     },
            // },
            // candidateItemId: {
            //     type: DataTypes.UUID,
            //     allowNull: false,
            //     references: {
            //         model: CandidateItem({ sequelize }),
            //         key: 'id',
            //     },
            // },

            topicTitle: {
                type: DataTypes.STRING,
                allowNull: false,
                // references: {
                //     model: Topic({ sequelize }),
                //     key: 'title',
                // },
            },
            topicType: {
                type: DataTypes.ENUM('poll', 'event'),
                allowNull: false,
                // references: {
                //     model: Topic({ sequelize }),
                //     key: 'type',
                // },
            },

            // 반정규화
            topicStatus: {
                type: DataTypes.ENUM('open', 'close', 'deleted'),
                allowNull: false,
            },
            topicIsSecretVote: {
                type: DataTypes.BOOLEAN,
                // references: {
                //     model: Topic({ sequelize }),
                //     key: 'isSecretVote',
                // },
            },
            topicIsPlurality: {
                type: DataTypes.BOOLEAN,
                // references: {
                //     model: Topic({ sequelize }),
                //     key: 'isPlurality',
                // },
            },
            topicCastingVote: {
                type: DataTypes.STRING,
                // references: {
                //     model: Topic({ sequelize }),
                //     key: 'castingVote',
                // },
            },
            topicResultOpen: {
                type: DataTypes.BOOLEAN,
                // references: {
                //     model: Topic({ sequelize }),
                //     key: 'resultOpen',
                // },
            },
            topicStartDate: {
                type: DataTypes.DATE,
                // references: {
                //     model: Topic({ sequelize }),
                //     key: 'startDate',
                // },
            },
            topicEndDate: {
                type: DataTypes.DATE,
                // references: {
                //     model: Topic({ sequelize }),
                //     key: 'endDate',
                // },
            },
            topicCreatedAt: {
                type: DataTypes.DATE,
                // references: {
                //     model: Topic({ sequelize }),
                //     key: 'createdAt',
                // },
            },

            candidateDetail: {
                type: DataTypes.STRING,
                // references: {
                //     model: CandidateItem({ sequelize }),
                //     key: 'detail',
                // },
            },
            candidateElected: {
                type: DataTypes.BOOLEAN,
                // references: {
                //     model: CandidateItem({ sequelize }),
                //     key: 'elected',
                // },
            },
            candidateOrder: {
                type: DataTypes.INTEGER,
                // references: {
                //     model: CandidateItem({ sequelize }),
                //     key: 'order',
                // },
            },
        },
        {
            tableName: 'voted_items',
            paranoid: true,
            indexes: [
                {
                    type: 'FULLTEXT',
                    fields: ['topicTitle'],
                },
            ],
        }
    );
};
