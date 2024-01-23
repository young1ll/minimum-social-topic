import { EventTopicAttributes } from '@/models/eventTopic.model';

export interface IEventRepo {
    // Event 생성
    create(
        input: Pick<EventTopicAttributes, 'topicId'> & Partial<EventTopicAttributes>
    ): Promise<EventTopicAttributes>;

    // topicId로 특정 Event data 가져오기
    getEventByTopicId(
        topicId: Pick<EventTopicAttributes, 'topicId'> | string
    ): Promise<EventTopicAttributes | null>;

    // All Event list
    getAllEvents(): Promise<EventTopicAttributes[] | null>;

    // Event 검색
    searchEvent(query: string): Promise<EventTopicAttributes[] | null>;

    // Event id로 특정 Event data 변경
    updateEvent(
        topicId: Pick<EventTopicAttributes, 'topicId'> | string,
        event: Partial<EventTopicAttributes>
    ): Promise<number>;

    deleteEvent(topicId: Pick<EventTopicAttributes, 'topicId'> | string): Promise<number>;
}
