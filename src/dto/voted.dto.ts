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
