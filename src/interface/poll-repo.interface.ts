import { PollTopicAttributes } from '@/models/pollTopic.model';

export interface IPollRepo {
    // Poll 생성
    create(
        input: Pick<PollTopicAttributes, 'topicId'> & Partial<PollTopicAttributes>
    ): Promise<PollTopicAttributes>;

    // Poll id로 특정 Poll data 가져오기
    getPollBytopicId(
        topicId: Pick<PollTopicAttributes, 'topicId'> | string
    ): Promise<PollTopicAttributes | null>;

    // All Poll list
    getAllPolls(): Promise<PollTopicAttributes[] | null>;

    // Poll 검색: content
    searchPoll(query: string): Promise<PollTopicAttributes[] | null>;

    // topicId로 특정 Poll data 변경
    updatePoll(
        topicId: Pick<PollTopicAttributes, 'topicId'> | string,
        poll: Partial<PollTopicAttributes>
    ): Promise<number>;

    deletePoll(topicId: Pick<PollTopicAttributes, 'topicId'>): Promise<number>;
}
