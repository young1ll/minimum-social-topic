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
    countByUserId(userId: string, type?: TopicType): Promise<number>;

    // 특정 Topic의 상세 데이터
    getTopicByTopicId(topicId: string): Promise<TopicAttributes | null>;

    // 모든 Topic 목록
    // filter: userId, type
    // order: createdAt, [asc, desc]
    getAll(
        order?: 'asc' | 'desc',
        userId?: string,
        type?: TopicType
    ): Promise<TopicAttributes[] | []>;

    // Topic 검색
    searchTopic(query: string): Promise<TopicAttributes[] | []>;

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

    updateViewsByTopicId({
        transaction,
        id,
    }: {
        transaction: Transaction;
        id: string;
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
