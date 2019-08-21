import { Controller, Post, Body, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { CreateClipDto } from './dto/create-clip.dto';
import { ClipsService } from './clips.service';

@Controller('clips')
export class ClipsController {

    //depenency inject service
    constructor(private clipService: ClipsService){}

    @Post()
    createClip(@Body(ValidationPipe) createClipDto: CreateClipDto, @Body(ParseIntPipe) channel_id: number){
        return this.clipService.createClip(createClipDto)
    }
}
