import { IsString, IsNotEmpty, IsOptional, IsNumberString } from "class-validator";

export class DeleteCommentDto{
    
    @IsNotEmpty()
    @IsNumberString()
    comment_id: number;
}