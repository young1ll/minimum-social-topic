import { DataTypes, Sequelize } from 'sequelize';
import { Topic } from './topic.model';

export interface CandidateItemAttributes {
    id: string;
    topicId: string;
    order: number;
    detail?: string;
    elected?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export const CandidateItem = ({ sequelize }: { sequelize: Sequelize }) => {
    return sequelize.define(
        'candidateItem',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            // topicId: {
            //     type: DataTypes.UUID,
            //     references: {
            //         model: Topic({ sequelize }),
            //         key: 'id',
            //     },
            // },
            order: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            detail: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            elected: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: 'candidate_items',
        }
    );
};
