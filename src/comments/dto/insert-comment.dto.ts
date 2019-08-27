import { IsString, IsNotEmpty, IsOptional, IsNumberString } from "class-validator";

export class InsertCommentDto{
    @IsNotEmpty()
    @IsString()
    text: string; //the comment as a text


    @IsNotEmpty()
    @IsNumberString()
    clip_id: number;
}