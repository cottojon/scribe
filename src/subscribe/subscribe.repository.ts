import { Repository, EntityRepository } from "typeorm";
import { Subscribe } from "./subscribe.entity";



@EntityRepository(Subscribe)
export class SubscribeRepository extends Repository<Subscribe>{

}