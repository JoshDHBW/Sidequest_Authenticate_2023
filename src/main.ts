import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /** Swagger  **/
  const config = new DocumentBuilder()
    .setTitle('Authorization Service')
    .setDescription('The API description for the authorization service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('authentication-srv');
  app.enableCors();
  await app.listen(3010, '192.168.178.65');
}
bootstrap();
