import { TopicType } from '@/dto/type.dto';
import { TopicAttributes } from '@/models/topic.model';
import { Transaction } from 'sequelize';

export interface ITopicRepo {
    create({
        transaction,
        input,
    }: {
        transaction: Transaction;
        input: Pick<TopicAttributes, 'userId' | 'title' | 'type'>;
    }): Promise<TopicAttributes>;

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
    updateTopicById({
        transaction,
        id,
        topic,
    }: {
        transaction: Transaction;
        id: string;
        topic: Partial<TopicAttributes>;
    }): Promise<number>;

    // Topic id로 특정 Topic data 삭제
    deleteTopicById({ transaction, id }: { transaction: Transaction; id: string }): Promise<number>;

    deleteTopicsById({
        transaction,
        ids,
    }: {
        transaction: Transaction;
        ids: string | string[];
    }): Promise<number>;
}
