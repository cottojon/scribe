import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeRepository } from './like.repository';
import { Like } from './like.entity';

@Injectable()
export class LikesService {
    //dependency inject like repository
    constructor(@InjectRepository(LikeRepository) private likeRepository: LikeRepository){}
    

    
}
