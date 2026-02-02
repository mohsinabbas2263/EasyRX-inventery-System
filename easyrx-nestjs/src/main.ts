import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security Headers
  // Configure helmet to allow cross-origin resources, as CORS is handled by app.enableCors()
  app.use(helmet({ crossOriginResourcePolicy: false }));

  const configService = app.get(ConfigService);

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS configuration
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS');
  app.enableCors({
    origin: allowedOrigins ? allowedOrigins.split(',') : false,
    credentials: true,
  });

  // Versioning
  app.setGlobalPrefix('api');

  const port = configService.get('PORT', 3000);

  // Swagger Documentation - Disabled in Production for security
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('EazyRX API')
      .setDescription('Pharmacy Inventory Management System API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
    logger.log(`✓ API Documentation: http://localhost:${port}/api-docs`);
  } else {
    logger.log('⚠ API Documentation (Swagger) is disabled in production.');
  }

  await app.listen(port);
  logger.log(`✓ EazyRX Backend running on port ${port}`);
  logger.log(`✓ Environment: ${configService.get('NODE_ENV', 'development')}`);
}

bootstrap().catch((err) => {
  new Logger('Bootstrap').error('Bootstrap failed:', err);
  process.exit(1);
});
