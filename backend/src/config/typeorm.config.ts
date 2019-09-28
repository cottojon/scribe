import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');
//first we use env variables then we fall back with config
//RDS is a amazon db service
export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type, // database type so it know which driver to use (pg)
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    port: process.env.RDS_PORT || dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD ||dbConfig.password,
    database: process.env.RDS_DATABASE || dbConfig.database,
    entities: [__dirname + '/../**/*.entity.{js,ts}'] ,// our tables represented as files
    // config folder than src folder, than any folder and any file with a entity.js or entity.ts extension
    synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize, // everytime connection start it will sync up with schemas from postgresql db
    // in production recommended to not be true

};
