import {
    Allow,
    IsArray,
    IsBoolean,
    IsDate,
    IsEmpty,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class TopicCreateReq {
    // topic entity
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsEnum(['poll', 'event'])
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(['pending', 'open', 'close'])
    @IsOptional()
    status?: string;

    @IsBoolean()
    @IsOptional()
    isSecretVote?: boolean;

    @IsString()
    @IsOptional()
    castingVote?: string; //userId

    @IsBoolean()
    @IsOptional()
    resultOpen?: boolean;

    @IsDate()
    @IsOptional()
    startDate?: Date;

    @IsDate()
    @IsOptional()
    endDate?: Date;
}

export class GetTopicReq {
    @IsUUID()
    @IsNotEmpty()
    topicId: string;
}

export class GetAllTopicReq {
    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class UpdateTopicReq {
    @IsUUID()
    @IsNotEmpty()
    topicId: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsEnum(['poll', 'event'])
    @IsOptional()
    type: string;

    @IsString()
    @IsOptional()
    title: string;

    @IsEnum(['pending', 'open', 'close'])
    @IsOptional()
    status?: string;

    @IsBoolean()
    @IsOptional()
    isSecretVote?: boolean;

    @IsString()
    @IsOptional()
    castingVote?: string; //userId

    @IsBoolean()
    @IsOptional()
    resultOpen?: boolean;

    @IsDate()
    @IsOptional()
    startDate?: Date;

    @IsDate()
    @IsOptional()
    endDate?: Date;
}

export class DeleteTopicReq {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsUUID()
    @IsNotEmpty()
    topicId: string;
}

export class DeleteTopicsReq {
    @IsArray()
    @IsNotEmpty()
    topicIds: string[];
}
