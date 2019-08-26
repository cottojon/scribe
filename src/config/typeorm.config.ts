import {TypeOrmModuleOptions} from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres', // database type so it know which driver to use (pg)
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'scribe',
    entities: [__dirname + '/../**/*.entity.{js,ts}'] ,// our tables represented as files
    // config folder than src folder, than any folder and any file with a entity.js or entity.ts extension
    synchronize: true, // everytime connection start it will sync up with schemas from postgresql db
    // in production recommended to not be true

};
