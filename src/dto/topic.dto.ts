import {
    Allow,
    IsArray,
    IsBoolean,
    IsDate,
    IsEmpty,
    IsEnum,
    IsNotEmpty,
    IsNumber,
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

    @IsNumber()
    @IsOptional()
    isMultiChoice?: number;

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
    @IsOptional()
    userId: string;

    @IsEnum(['poll', 'event'])
    @IsOptional()
    type: string;

    @IsEnum(['asc', 'desc'])
    @IsOptional()
    order: 'asc' | 'desc';
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

    @IsNumber()
    @IsOptional()
    isMultiChoice?: number;

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

export class UpdateTopicViewReq {
    @IsUUID()
    @IsNotEmpty()
    topicId: string;

    @IsString()
    @IsOptional()
    userId: string;
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
