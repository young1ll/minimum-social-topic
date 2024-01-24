import { IPollRepo } from '@/interface/poll-repo.interface';
import db from '@/models';
import { PollTopicAttributes } from '@/models/pollTopic.model';
import { Sequelize, Op } from 'sequelize';

const PollTopic = db.PollTopic;

export class PollRepository implements IPollRepo {
    async create(
        input: Pick<PollTopicAttributes, 'topicId'> & Partial<PollTopicAttributes>
    ): Promise<PollTopicAttributes> {
        const { topicId, description } = input;
        const data = await PollTopic.create({ topicId, description });

        return data.toJSON();
    }
    async getPollBytopicId(
        topicId: Pick<PollTopicAttributes, 'topicId'> | string
    ): Promise<PollTopicAttributes | null> {
        const data = await PollTopic.findOne({
            where: {
                topicId,
            },
        });

        return data?.toJSON() || null;
    }
    async getAllPolls(): Promise<PollTopicAttributes[] | null> {
        const data = await PollTopic.findAll();

        return data?.map((poll) => poll.toJSON()) || null;
    }
    async searchPoll(query: string): Promise<PollTopicAttributes[] | null> {
        const data = await PollTopic.findAll({
            where: Sequelize.literal(`(
          content COLLATE utf8mb4_general_ci LIKE '%${query}%'
        )`),
        });

        return data?.map((poll) => poll.toJSON()) || null;
    }
    async updatePoll(input: PollTopicAttributes): Promise<number> {
        const { topicId, description } = input;
        const data = await PollTopic.update(
            { description },
            {
                where: {
                    topicId,
                },
            }
        );

        return data[0];
    }

    async deletePoll(topicId: Pick<PollTopicAttributes, 'topicId'> | string): Promise<number> {
        const data = await PollTopic.destroy({
            where: {
                topicId,
            },
        });

        return data;
    }
}
