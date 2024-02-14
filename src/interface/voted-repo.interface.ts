import { VotedItemAttributes } from '@/models/votedItem.model';
import { Transaction } from 'sequelize';

export interface IVotedItemRepo {
    // VotedItem 생성
    create({
        transaction,
        ids,
        input,
    }: {
        transaction: Transaction;
        ids: Pick<VotedItemAttributes, 'topicId' | 'userId' | 'candidateItemId'>;
        input: Partial<Omit<VotedItemAttributes, 'id' | 'topicId' | 'userId' | 'candidateItemId'>>;
    }): Promise<VotedItemAttributes>;

    // votedId로 특정 VotedItem 가져오기
    getVotedItemById(votedId: string): Promise<VotedItemAttributes | null>;

    // TopicId로 해당 Topic의 모든 VotedItem 가져오기

    // userId로 특정 모든 VotedItem 가져오기
    getVotedItemByUserId(userId: string): Promise<VotedItemAttributes[] | null>;

    // TopicId와 userId로 특정 VotedItem 가져오기
    // 여러개 존재할 수도 있음(isPlurality: true)
    getVotedItemByUserIdAndTopicId(
        userId: string,
        topicID: string
    ): Promise<VotedItemAttributes | VotedItemAttributes[] | null>;

    // userId에 따른 votedItem 갯수
    countVotedItemByUserId(userId: string): Promise<number>;

    // topicId에 따른 votedItem 갯수
    countVotedItemByTopicId(topicId: string): Promise<number>;

    searchVotedItemByTopicTitle(query: string): Promise<VotedItemAttributes[] | null>;

    // votedItem 변경하기
    updatedVotedItem({
        transaction,
        votedId,
        input,
    }: {
        transaction: Transaction;
        votedId: string;
        input: Partial<Omit<VotedItemAttributes, 'id'>>;
    }): Promise<number>;

    // votedItem 삭제
    deleteVotedItem({
        transaction,
        votedId,
    }: {
        transaction: Transaction;
        votedId: string;
    }): Promise<number>;

    // votedItems 삭제
    deleteVotedItems({
        transaction,
        votedIds,
    }: {
        transaction: Transaction;
        votedIds: string[];
    }): Promise<number>;
}
