import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClipDto } from './dto/create-clip.dto';
import { ClipRepository } from './clip.repository';
import { Clip } from './clip.entity';
import { GetClipFilterDto } from './dto/get-clip-filter.dto';
import { UpdateClipDto } from './dto/update-clip.dto';

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


    async updateClipText(id: number, updateClipDto: UpdateClipDto): Promise<Clip>{
        //destruct dto
        const {revised_text} = updateClipDto;
        
        //retrieve clip
        const clip = await this.getClipById(id);

        //update columns
        clip.revised = true;
        clip.revised_text = revised_text;


        //save the clip back into the database
        await clip.save();


        return clip;
    }



    async deleteTaskById(id: number): Promise<void>{
        //delete the task using the repository
        const result = await this.clipRepository.delete(id);
        // if we did not delete anything throw exception
        if(result.affected === 0){ // affected == the amount of rows deleted
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }
}
