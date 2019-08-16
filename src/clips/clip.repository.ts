import { Repository, Entity, EntityRepository } from "typeorm";
import { Clip } from "./clip.entity";


@EntityRepository(Clip)
export class ClipRepository extends Repository<Clip>{

}