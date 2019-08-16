import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelRepository } from './channel.repository';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel } from './channel.entity';

@Injectable()
export class ChannelsService {

    //dependency inject channel repository
    constructor(@InjectRepository(ChannelRepository) private channelRepostory: ChannelRepository ){

    }

    //service method for creating a channel
    //if we reach this point our paramaters have already gone through validation
    async createChannel(createChannelDto: CreateChannelDto): Promise<Channel>{
        return await this.channelRepostory.insertChannel(createChannelDto);

    }
}
