import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { port } from './config/env';
import path from 'node:path';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix('api');

  app.register(require('@fastify/swagger'), {
    mode: 'static',
    prefix: '/swagger',
    specification: {
      path: path.join(__dirname, '..', 'swagger', 'schema.json'),
    },
  });

  app.register(require('@fastify/swagger-ui'), {
    routePrefix: '/api/docs',
  });
  console.log(port);
  await app.listen({ port, host: '0.0.0.0' });
}

bootstrap();
