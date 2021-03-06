import { IsString, IsNotEmpty, IsOptional, IsInt } from "class-validator";

export class CreateClipDto{
   
    //@IsInt()
   // @IsNotEmpty()
    //channel_id: number;

    @IsString()
    @IsNotEmpty()
    text: string; 

    @IsString()
    @IsNotEmpty()
    path_to_file: string;


    @IsString()
    @IsNotEmpty()
    speaker: string;
}