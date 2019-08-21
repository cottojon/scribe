import { Injectable } from '@nestjs/common';
import { CreateClipDto } from './dto/create-clip.dto';
import { ClipRepository } from './clip.repository';

@Injectable()
export class ClipsService {

    //dependency inject clip repository
    constructor(private clipRepository: ClipRepository){}

    async createClip(createClipDto: CreateClipDto){
        return await this.clipRepository.createClip(createClipDto);
    }
}
