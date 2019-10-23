import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

//by default NODE_ENV === undefined
//when this is undefined, config chooses the development.yml by default


async function bootstrap() {
  const serverConfig = config.get('server'); //define in config/default.yml
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..','static')); //this is for testing websockets
  app.enableCors(); //allows for cross origin communication

  
  const port = process.env.PORT || serverConfig.port; //first check env variables then go with config

  await app.listen(port);

  console.log(`Server running on port ${port}`);
}
bootstrap();
