import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscribeRepository } from './subscribe.repository';
import { User } from 'src/auth/user.entity';
import { Subscribe } from './subscribe.entity';

@Injectable()
export class SubscribeService {
    

    //dependency inject repository
    constructor(@InjectRepository(SubscribeRepository) private subscribeRepository: SubscribeRepository){}


    async subscribeUserToChannel(channel_id: number, user: User): Promise<Subscribe> {
        return this.subscribeRepository.subscribeUserToChannel(channel_id, user);
    }
}
