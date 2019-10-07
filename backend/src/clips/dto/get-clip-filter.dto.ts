import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString, IsNumberString } from "class-validator";

export class GetClipFilterDto {

    @IsNumberString()
    @IsOptional()
    channel_id: string;

    @IsString()
    @IsOptional()
    channel_name: string;

    @IsString()
    @IsOptional()
    text: string;

    @IsString()
    @IsOptional()
    speaker: string;

    @IsDateString()
    @IsOptional()
    start_date: Date;


    @IsDateString()
    @IsOptional()
    end_date: Date;

}