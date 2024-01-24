import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class CandidateCreateReq {
    @IsUUID()
    @IsNotEmpty()
    topicId: string;

    @IsNumber()
    @IsNotEmpty()
    order: number;

    @IsString()
    @IsNotEmpty()
    detail: string;
}

export class CandidateCountReq {
    @IsUUID()
    @IsOptional()
    topicId: string;

    @IsEnum(['true', 'false'])
    @IsOptional()
    elected: string;
}

export class CandidateDeleteReq {
    @IsUUID()
    @IsNotEmpty()
    candidateId: string;
}
