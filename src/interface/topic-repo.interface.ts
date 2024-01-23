import { TopicType } from '@/dto/type.dto';
import { TopicAttributes } from '@/models/topic.model';

export interface ITopicRepo {
    create(
        createInput: Pick<TopicAttributes, 'userId' | 'title' | 'type'>
    ): Promise<TopicAttributes>;

    // 사용자의 Topic 수
    count(userId: string, type?: TopicType): Promise<number>;

    // 특정 Topic의 상세 데이터
    getTopicByTopicId(topicId: string): Promise<TopicAttributes | null>;

    // 사용자의 모든 Topic list
    getAllTopicsByUserId(userId: string): Promise<TopicAttributes[] | null>;
    // getTopicByUserIdAndId(userId: string, topicId: string): Promise<TopicAttributes>

    // Topic 검색
    searchTopic(query: string): Promise<TopicAttributes[] | null>;

    // Topic id로 특정 Topic data 수정
    updateTopicById(id: string, topic: Partial<TopicAttributes>): Promise<number>;

    // Topic id로 특정 Topic data 삭제
    deleteTopicById(id: string): Promise<number>;

    deleteTopicsById(id: string[]): Promise<number>;
}
