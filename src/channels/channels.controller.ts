import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelsService } from './channels.service';
import { Channel } from './channel.entity';

@Controller('channels')
export class ChannelsController {

    //Dependency inject channelService
    constructor(private channelsService: ChannelsService){}

    /*
    Create Channel Handler
    The body will have 4 paramaters adn will be validated using Validation Pipe
    The parameters will be parsed and placed inside of createChannelDto
    */
    @Post() 
    createChannel(@Body(ValidationPipe) createChannelDto: CreateChannelDto): Promise<Channel>{
        return this.channelsService.createChannel(createChannelDto);
    }





}
