import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscribeRepository } from './subscribe.repository';
import { Subscribe } from './subscribe.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class SubscribeService {



    //dependency inject repository
    constructor(@InjectRepository(SubscribeRepository) private subscribeRepository: SubscribeRepository) { }


    async subscribeUserToChannel(channel_id: number, user: User): Promise<Subscribe> {
        return this.subscribeRepository.subscribeUserToChannel(channel_id, user);
    }


    async getUserSubscribedChannels(user: User): Promise<Subscribe[]> {
        //find all the channels by userId
        const channels = await this.subscribeRepository.find({ userId: user.id });

        return channels;
    }


    async unsubscribeUserToChannel(channel_id: number, user: User): Promise<void> {
        //delete the task using the repository
        const result = await this.subscribeRepository.delete({ channelId: channel_id, userId: user.id });
        // if we did not delete anything throw exception
        if (result.affected === 0) { // affected == the amount of rows deleted
            throw new NotFoundException(`Channel with ID ${channel_id} not found`);
        }
    }
}
