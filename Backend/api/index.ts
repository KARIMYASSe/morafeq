import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import cookieParser from 'cookie-parser';

import { AppModule } from '../src/app.module';

const expressApp = express();

let initialized = false;

async function bootstrap() {
  if (initialized) {
    return;
  }

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api/v1');

  await app.init();

  initialized = true;
}

export default async function handler(req: any, res: any) {
  await bootstrap();

  return expressApp(req, res);
}