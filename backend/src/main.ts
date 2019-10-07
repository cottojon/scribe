import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

//by default NODE_ENV === undefined
//when this is undefined, config chooses the development.yml by default


async function bootstrap() {
  const serverConfig = config.get('server'); //define in config/default.yml
  const app = await NestFactory.create(AppModule);

  app.enableCors(); //allows for cross origin communication

  
  const port = process.env.PORT || serverConfig.port; //first check env variables then go with config

  await app.listen(port);

  console.log(`Server running on port ${port}`);
}
bootstrap();
