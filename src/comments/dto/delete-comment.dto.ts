import { IsString, IsNotEmpty, IsOptional, IsNumberString } from "class-validator";

export class DeleteCommentDto{
    @IsNotEmpty()
    @IsNumberString()
    clip_id: number; 


    @IsNotEmpty()
    @IsNumberString()
    comment_id: number;
}