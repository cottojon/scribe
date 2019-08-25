import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscribeRepository } from './subscribe.repository';

@Injectable()
export class SubscribeService {

    //dependency inject repository
    constructor(@InjectRepository(SubscribeRepository) private subscribeRepository: SubscribeRepository){}

}
