import { CandidateItemAttributes } from '@/models/candidateItem.model';
import { Transaction } from 'sequelize';

export interface ICandidateRepo {
    // Candidate Item 생성
    // 모든 값을 받아야 함
    create({
        transaction,
        input,
    }: {
        transaction: Transaction;
        input: Omit<CandidateItemAttributes, 'id'>;
    }): Promise<CandidateItemAttributes>;

    // candidateId로 특정 Candidate Item 가져오기
    getCandidateItemById(candidateId: string): Promise<CandidateItemAttributes | null>;

    // TopicId로 해당 Topic의 모든 Candidate Item 가져오기
    getCandidateItemByTopicId(topicId: string): Promise<CandidateItemAttributes[] | null>;

    // 모든 Candidate Item 가져오기
    getAllCandidateItems(): Promise<CandidateItemAttributes[] | null>;

    count(topicId?: string, elected?: boolean): Promise<number>;

    // candidateId 로 특정 Candidate Item 변경
    updateCandidateItem({
        transaction,
        candidateId,
        input,
    }: {
        transaction: Transaction;
        candidateId: string;
        input: Partial<Omit<CandidateItemAttributes, 'id'>>;
    }): Promise<number>;

    // candidateId로 특정 Candidate Item 삭제
    deleteCandidateItem({
        transaction,
        candidateId,
    }: {
        transaction: Transaction;
        candidateId: string;
    }): Promise<number>;

    // candidateId 배열로 여러 Candidate Item 삭제
    deleteCandidatesByIds({
        transaction,
        candidateIds,
    }: {
        transaction: Transaction;
        candidateIds: string | string[];
    }): Promise<number>;
}
