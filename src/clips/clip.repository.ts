import { Repository, Entity, EntityRepository } from "typeorm";
import { Clip } from "./clip.entity";
import { createClipDto } from "./dto/create-clip.dto";


@EntityRepository(Clip)
export class ClipRepository extends Repository<Clip>{

    


    createClip(createClipDto: createClipDto): Promise<Clip>{
        //destruct dto
        const {channel_id, text, path_to_file} = createClipDto;


        //find the channel 


        //create clip
        const clip = new Clip();
        clip.text = text;
        clip.channel = channel_id;

    }

}