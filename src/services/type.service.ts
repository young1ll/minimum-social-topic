import { IEventRepo } from '@/interface/event-repo.interface';
import { IPollRepo } from '@/interface/poll-repo.interface';
import { PollTopicAttributes } from '@/models/pollTopic.model';
import { EventTopicAttributes } from '@/models/eventTopic.model';
import { TopicType } from '@/dto/type.dto';

type TypeAttributes = PollTopicAttributes | EventTopicAttributes;

export class TypeService {
    private _pollRepository: IPollRepo;
    private _eventRepository: IEventRepo;

    constructor({ pollRepo, eventRepo }: { pollRepo: IPollRepo; eventRepo: IEventRepo }) {
        this._pollRepository = pollRepo;
        this._eventRepository = eventRepo;
    }

    async createType({
        type,
        input,
    }: {
        type: TopicType;
        input: PollTopicAttributes | EventTopicAttributes;
    }): Promise<TypeAttributes> {
        try {
            if (!type) throw new Error('type is required');

            const { topicId, content, ...rest } = input;
            if (!topicId) throw new Error('topicId is required');

            switch (type) {
                case 'poll':
                    return await this._pollRepository.create({ topicId, content });

                case 'event':
                    return await this._eventRepository.create({ topicId, content, ...rest });
            }
        } catch (error) {
            throw error;
        }
    }

    async getTypeByTopicId({
        type,
        topicId,
    }: {
        type: TopicType;
        topicId: Pick<TypeAttributes, 'topicId'> | string;
    }): Promise<TypeAttributes | null> {
        try {
            if (!topicId) throw new Error('topicId is required');

            switch (type) {
                case 'poll':
                    return await this._pollRepository.getPollBytopicId(topicId);

                case 'event':
                    return await this._eventRepository.getEventByTopicId(topicId);
            }
        } catch (error) {
            throw error;
        }
    }

    async getAllType({ type }: { type: TopicType }): Promise<TypeAttributes[] | null> {
        try {
            if (!type) throw new Error('type is required');

            switch (type) {
                case 'poll':
                    return await this._pollRepository.getAllPolls();
                case 'event':
                    return await this._eventRepository.getAllEvents();
            }
        } catch (error) {
            throw error;
        }
    }

    async updateType({
        type,
        input,
    }: {
        type: TopicType;
        input: PollTopicAttributes | EventTopicAttributes;
    }): Promise<number> {
        try {
            if (!type) throw new Error('type is required');

            const { topicId, content, ...rest } = input;
            if (!topicId) throw new Error('topicId is required');

            switch (type) {
                case 'poll':
                    return await this._pollRepository.updatePoll(topicId, { content });
                case 'event':
                    return await this._eventRepository.updateEvent(topicId, { content, ...rest });
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteType({
        type,
        topicId,
    }: {
        type: TopicType;
        topicId: Pick<TypeAttributes, 'topicId'>;
    }): Promise<number> {
        try {
            if (!topicId) throw new Error('topicId is required');

            switch (type) {
                case 'poll':
                    return await this._pollRepository.deletePoll(topicId);
                case 'event':
                    return await this._eventRepository.deleteEvent(topicId);
            }
        } catch (error) {
            throw error;
        }
    }
}
