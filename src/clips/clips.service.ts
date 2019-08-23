import { Injectable } from '@nestjs/common';
import { CreateClipDto } from './dto/create-clip.dto';
import { ClipRepository } from './clip.repository';
import { Clip } from './clip.entity';

@Injectable()
export class ClipsService {

    //dependency inject clip repository
    constructor(private clipRepository: ClipRepository){}

    async createClip(createClipDto: CreateClipDto, channel_id: number): Promise<Clip>{
        return await this.clipRepository.createClip(createClipDto, channel_id);
    }
}
