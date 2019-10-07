import { IsString, IsNotEmpty} from "class-validator";

export class UpdateClipDto {

    @IsString()
    @IsNotEmpty()
    revised_text: string;
}