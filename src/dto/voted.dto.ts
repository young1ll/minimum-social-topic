import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class VotedCreateReq {
    // VotedItem IDs
    @IsUUID()
    @IsNotEmpty()
    candidateItemId: string;

    @IsUUID()
    @IsNotEmpty()
    topicId: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class VotedGetReq {
    @IsUUID()
    @IsNotEmpty()
    topicId: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class VotedGetQuery {
    @IsUUID()
    @IsOptional()
    topicId: string;

    @IsString()
    @IsOptional()
    userId: string;
}

export class VotedUpdateReq {
    @IsUUID()
    @IsNotEmpty()
    votedId: string;

    @IsUUID()
    @IsNotEmpty()
    candidateItemId: string;
}

export class VotedDeleteReq {
    @IsUUID()
    @IsNotEmpty()
    votedId: string;
}
