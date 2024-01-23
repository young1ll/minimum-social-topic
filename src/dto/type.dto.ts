import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export type TopicType = 'poll' | 'event';

export function isTopicType(type: string): type is TopicType {
    return type === 'poll' || type === 'event';
}

export class TypeCreateReq {
    @IsUUID()
    @IsNotEmpty()
    topicId: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsDate()
    @IsOptional()
    eventDate?: Date;

    @IsString()
    @IsOptional()
    eventLocation?: string;
}
