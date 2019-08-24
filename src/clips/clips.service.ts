import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClipDto } from './dto/create-clip.dto';
import { ClipRepository } from './clip.repository';
import { Clip } from './clip.entity';
import { GetClipFilterDto } from './dto/get-clip-filter.dto';

@Injectable()
export class ClipsService {

    //dependency inject clip repository
    constructor(private clipRepository: ClipRepository){}

    async createClip(createClipDto: CreateClipDto, channel_id: number): Promise<Clip>{
        return await this.clipRepository.createClip(createClipDto, channel_id);
    }


    async getClipById(id: number): Promise<Clip>{
        //get clip from database
        const clip = await this.clipRepository.findOne({id});

        //throw exception if no clip was found
        if(!clip){
            throw new NotFoundException(`Clip with ID ${id} not found`);
        }


        return clip;
    }



    async getClips(getClipFilterDto: GetClipFilterDto): Promise<Clip[]>{ //return an array of task
        return await this.clipRepository.getClips(getClipFilterDto);
    }
}
