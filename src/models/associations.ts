import { CandidateItem } from './candidateItem.model';
import { EventTopic } from './eventTopic.model';
import User from './lagacy-tables/user.model';
import { PollTopic } from './pollTopic.model';
import { Topic } from './topic.model';
import { VotedItem } from './votedItem.model';

User.hasMany(Topic, { foreignKey: 'userId' });

Topic.belongsTo(User, { foreignKey: 'userId', constraints: false });
Topic.hasOne(EventTopic, { foreignKey: 'topicId' });
Topic.hasOne(PollTopic, { foreignKey: 'topicId' });
Topic.hasMany(CandidateItem, { foreignKey: 'topicId' });

EventTopic.belongsTo(Topic, { foreignKey: 'topicId' });
PollTopic.belongsTo(Topic, { foreignKey: 'topicId' });

CandidateItem.belongsTo(Topic, { foreignKey: 'topicId' });

VotedItem.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
VotedItem.belongsTo(Topic, {
    foreignKey: 'topicId',
    constraints: false,
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
});
VotedItem.belongsTo(CandidateItem, {
    foreignKey: 'candidateItemId',
    constraints: false,
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
});
