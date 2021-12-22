import { AppModule } from './modules/app.module';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.useLogger(app.get(Logger));
  app.enableCors({ methods: '*', origin: '*' });
  app.setGlobalPrefix('api');
  app.use('/healthz', (req, res) => {
    res.send('healthz OK');
  });

  const swaggerOptions = new DocumentBuilder()
    .setTitle(`Backend API`)
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, swaggerDocument, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
      defaultModelsExpandDepth: -1,
      persistAuthorization: true,
    },
  });

  const server = await app.listen(AppModule.port || process.env.PORT);
  server.setTimeout(180000);
}
bootstrap();
