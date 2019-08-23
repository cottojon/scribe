import { Controller, Post, Body, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { CreateClipDto } from './dto/create-clip.dto';
import { ClipsService } from './clips.service';
import { Clip } from './clip.entity';

@Controller('clips')
export class ClipsController {

    //depenency inject service
    constructor(private clipService: ClipsService){}

    @Post()
    createClip(@Body('channel_id', ParseIntPipe) channel_id: number, @Body(ValidationPipe) createClipDto: CreateClipDto, ): Promise<Clip>{
        return this.clipService.createClip(createClipDto, channel_id);
    }
}
