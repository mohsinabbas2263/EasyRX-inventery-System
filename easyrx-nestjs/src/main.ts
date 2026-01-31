import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Security Headers
    // app.use(helmet());

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

    // CORS
    app.enableCors({
        origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'), // Default to localhost
        credentials: true,
    });

    // Versioning
    app.setGlobalPrefix('api');

    const port = configService.get('PORT', 3000);
    await app.listen(port);
    logger.log(`✓ EazyRX Backend running on port ${port}`);
    logger.log(`✓ Environment: ${configService.get('NODE_ENV', 'development')}`);
}

bootstrap().catch((err) => {
    new Logger('Bootstrap').error('Bootstrap failed:', err);
    process.exit(1);
});
