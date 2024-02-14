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

export class CandidateUpdateReq {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsUUID()
    @IsNotEmpty()
    topicId: string;

    @IsNumber()
    @IsOptional()
    order: number;

    @IsString()
    @IsOptional()
    detail?: string;

    @IsBoolean()
    @IsOptional()
    elected?: boolean;
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
