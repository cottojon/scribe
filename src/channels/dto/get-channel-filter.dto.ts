import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class GetChannelFilterDto{
    @IsOptional()
    @IsNotEmpty()
    name: string; //this string can be emtpy for the Get all task action
}