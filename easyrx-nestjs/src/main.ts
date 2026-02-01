import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);
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
    app.enableCors({
        origin: configService.get<string>('ALLOWED_ORIGINS', 'http://localhost:3000').split(','),
        credentials: true,
    });

    // Versioning
    app.setGlobalPrefix('api');

    // Swagger Documentation
    const config = new DocumentBuilder()
        .setTitle('EazyRX API')
        .setDescription('Pharmacy Inventory Management System API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    const port = configService.get('PORT', 3000);
    await app.listen(port);
    logger.log(`✓ EazyRX Backend running on port ${port}`);
    logger.log(`✓ Environment: ${configService.get('NODE_ENV', 'development')}`);
    logger.log(`✓ API Documentation: http://localhost:${port}/api-docs`);
}

bootstrap().catch((err) => {
    new Logger('Bootstrap').error('Bootstrap failed:', err);
    process.exit(1);
});
