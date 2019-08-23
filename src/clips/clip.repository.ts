import { Repository, Entity, EntityRepository, RelationQueryBuilder } from "typeorm";
import { Clip } from "./clip.entity";
import { CreateClipDto } from "./dto/create-clip.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelRepository } from "src/channels/channel.repository";
import { Channel } from "src/channels/channel.entity";
import { NotFoundException, InternalServerErrorException } from "@nestjs/common";


@EntityRepository(Clip)
export class ClipRepository extends Repository<Clip>{

    //inject the channel repository
    constructor(@InjectRepository(ChannelRepository) private channelRepository: ChannelRepository) {
        super();
    }


    async createClip(createClipDto: CreateClipDto, channel_id: number): Promise<Clip> {
        //destruct dto
        const { text, path_to_file, speaker } = createClipDto;

        //create clip
        const clip = new Clip();
        clip.text = text;
        clip.path_to_file = path_to_file;
        clip.speaker = speaker;
        clip.channelId = channel_id;
        clip.revised = false;

        var clip2;

        try {
             clip2 = await clip.save();

        } catch (error) {
            // channel_id does not belong to a channel thus it does not exist
            if(error.code === '23503'){
                throw new NotFoundException(`Channel ${channel_id} does not exist`);
            }else{ // probably due to non null column insertions or database connection drop
                throw new InternalServerErrorException('Could not insert into database');
            }
        }

        return clip2;

    }

}