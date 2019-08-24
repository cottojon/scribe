import { Controller, Post, Body, ValidationPipe, ParseIntPipe, Get, Param, Query, Patch } from '@nestjs/common';
import { CreateClipDto } from './dto/create-clip.dto';
import { ClipsService } from './clips.service';
import { Clip } from './clip.entity';
import { GetClipFilterDto } from './dto/get-clip-filter.dto';
import { UpdateClipDto } from './dto/update-clip.dto';

@Controller('clips')
export class ClipsController {

    //depenency inject service
    constructor(private clipService: ClipsService){}

    
    @Post()
    createClip(@Body('channel_id', ParseIntPipe) channel_id: number, @Body(ValidationPipe) createClipDto: CreateClipDto, ): Promise<Clip>{
        return this.clipService.createClip(createClipDto, channel_id);
    }



    @Get(':id')
    getClipById(@Param('id', ParseIntPipe) id: number): Promise<Clip>{
        return this.clipService.getClipById(id);
    }

    /*
    For this hanlder we can either get all clips in the database with the route
    /clips

    or
    
    We get clips based on the search criteria (see get-clip-filter.dto) as a query for example
    /clips?channel_id=3&text=failure
    */

    @Get()
    getAllClips(@Query(ValidationPipe) getClipFilterDto: GetClipFilterDto): Promise<Clip[]>{
        return this.clipService.getClips(getClipFilterDto);
    }

    /*
    This handler will update a clip text transciption (revised_text column)
    We send teh clip id in the url as a parameter, but the revised_text in http body
    as a key-value pair

    */

    @Patch(':id/revise_text')
    updateClipText(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateClipDto: UpdateClipDto): Promise<Clip>{
        return this.clipService()
    }
}
