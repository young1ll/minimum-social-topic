import { Dialect, Sequelize } from 'sequelize';
import { dbConfig } from '../config';
import User from './lagacy-tables/user.model';
import { Topic } from './topic.model';
import { EventTopic } from './eventTopic.model';
import { PollTopic } from './pollTopic.model';
import { CandidateItem } from './candidateItem.model';
import { VotedItem } from './votedItem.model';

const sequelize = new Sequelize({
    database: dbConfig.DB,
    username: dbConfig.USER,
    password: dbConfig.PASSWORD,
    host: dbConfig.HOST,
    dialect: dbConfig.dialect as Dialect,
    port: dbConfig.PORT || 3306,
});
const db = {
    Sequelize: Sequelize,
    sequelize,
    Topic: Topic({ sequelize }),
    EventTopic: EventTopic({ sequelize }),
    PollTopic: PollTopic({ sequelize }),
    CandidateItem: CandidateItem({ sequelize }),
    VotedItem: VotedItem({ sequelize }),
};

/**
 * Associations
 * 필요한 경우 Model 파일 내 컬럼에서 직접 설정할 수 있다.
 *  */
const legacyUser = User({ sequelize });
legacyUser.hasMany(db.Topic, { foreignKey: 'userId', onDelete: 'cascade', hooks: true });

db.Topic.belongsTo(legacyUser, { foreignKey: 'userId', onDelete: 'SET NULL' });

db.Topic.hasOne(db.EventTopic, { foreignKey: 'topicId', onDelete: 'cascade', hooks: true });
db.Topic.hasOne(db.PollTopic, { foreignKey: 'topicId', onDelete: 'cascade', hooks: true });
db.Topic.hasMany(db.CandidateItem, { foreignKey: 'topicId', onDelete: 'cascade', hooks: true });

db.PollTopic.belongsTo(db.Topic, { foreignKey: 'topicId' });
db.EventTopic.belongsTo(db.Topic, { foreignKey: 'topicId' });

db.CandidateItem.belongsTo(db.Topic, { foreignKey: 'topicId' });
db.CandidateItem.afterCreate(async (item, option) => {
    await db.Topic.increment(
        { candidateItemCount: 1 },
        { where: { id: item.getDataValue('topicId') } }
    );
});
db.CandidateItem.beforeDestroy(async (item, option) => {
    await db.Topic.decrement(
        { candidateItemCount: 1 },
        { where: { id: item.getDataValue('topicId') } }
    );
});

legacyUser.hasMany(db.VotedItem, { foreignKey: 'userId', onDelete: 'cascade', hooks: true });
db.VotedItem.belongsTo(legacyUser, { foreignKey: 'userId' });

db.Topic.hasMany(db.VotedItem, { foreignKey: 'topicId', onDelete: 'NO ACTION', hooks: true });
db.VotedItem.belongsTo(db.Topic, {
    foreignKey: 'topicId',
});

db.CandidateItem.hasMany(db.VotedItem, {
    foreignKey: 'candidateItemId',
    onDelete: 'NO ACTION',
    hooks: true,
});
db.VotedItem.belongsTo(db.CandidateItem, {
    foreignKey: 'candidateItemId',
});

export default db;
