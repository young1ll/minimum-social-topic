import { Dialect, Sequelize } from 'sequelize';
import dbConfig from '../config/db.config';
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
legacyUser.hasMany(db.Topic, { foreignKey: 'userId' });

db.Topic.belongsTo(legacyUser, { foreignKey: 'userId' });

db.Topic.hasOne(db.EventTopic, { foreignKey: 'topicId' });
db.Topic.hasOne(db.PollTopic, { foreignKey: 'topicId' });
db.Topic.hasMany(db.CandidateItem, { foreignKey: 'topicId' });

db.PollTopic.belongsTo(db.Topic, { foreignKey: 'topicId', onDelete: 'cascade', hooks: true });
db.EventTopic.belongsTo(db.Topic, { foreignKey: 'topicId', onDelete: 'cascade', hooks: true });

db.CandidateItem.belongsTo(db.Topic, { foreignKey: 'topicId', onDelete: 'cascade', hooks: true });
db.CandidateItem.afterCreate(async (item, option) => {
    await db.Topic.increment(
        { candidateCount: 1 },
        { where: { id: item.getDataValue('topicId') } }
    );
});
db.CandidateItem.afterDestroy(async (item, option) => {
    await db.Topic.decrement(
        { candidateCount: 1 },
        { where: { id: item.getDataValue('topicId') } }
    );
});

legacyUser.hasMany(db.VotedItem, { foreignKey: 'userId' });
db.VotedItem.belongsTo(legacyUser, { foreignKey: 'userId' });

db.Topic.hasMany(db.VotedItem, { foreignKey: 'topicId' });
db.VotedItem.belongsTo(db.Topic, {
    foreignKey: 'topicId',
    onDelete: 'NO ACTION',
    hooks: true,
});

db.CandidateItem.hasMany(db.VotedItem, { foreignKey: 'candidateItemId' });
db.VotedItem.belongsTo(db.CandidateItem, {
    foreignKey: 'candidateItemId',
    onDelete: 'NO ACTION',
    hooks: true,
});

// db.VotedItem.belongsTo(db.Topic, {
//     foreignKey: 'topicId',
//     constraints: false,
//     onDelete: 'NO ACTION',
//     onUpdate: 'cascade',
// });
// db.VotedItem.belongsTo(db.CandidateItem, {
//     foreignKey: 'candidateItemId',
//     constraints: false,
//     onDelete: 'NO ACTION',
//     onUpdate: 'cascade',
// });

export default db;
