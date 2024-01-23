import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class CandidateCountReq {
    @IsUUID()
    @IsOptional()
    topicId: string;

    @IsEnum(['true', 'false'])
    @IsOptional()
    elected: string;
}
