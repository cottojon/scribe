import { Controller, Post, Body, ValidationPipe, Get, Query, UseGuards } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelsService } from './channels.service';
import { Channel } from './channel.entity';
import { GetChannelFilterDto } from './dto/get-channel-filter.dto';
import { AuthGuard } from '@nestjs/passport';

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


    /*
    
    Get All channels or channels by name:


    When we get channels by name channel should be in a query string:
    channels/?name=thenametosearchfor

    When we get all channels we should have no query strings or any thing in the request body
    channels/
    The body will just have a name
    */
    @Get()
    @UseGuards(AuthGuard())
    getChannels(@Query(ValidationPipe) channelFilterDto: GetChannelFilterDto): Promise<Channel[]>{
        return this.channelsService.getChannels(channelFilterDto);
    }



}
