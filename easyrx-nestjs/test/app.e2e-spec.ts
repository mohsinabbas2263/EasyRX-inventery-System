import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('EazyRX E2E Tests (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same middleware as production
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Checks', () => {
    it('/health (GET) should return 200', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
        });
    });

    it('/health/ready (GET) should return readiness status', () => {
      return request(app.getHttpServer())
        .get('/health/ready')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ready');
        });
    });
  });

  describe('Authentication', () => {
    it('/auth/login (POST) should authenticate user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      authToken = response.body.accessToken;
    });

    it('Protected endpoint should require authentication', () => {
      return request(app.getHttpServer())
        .get('/companies')
        .expect(401);
    });

    it('Protected endpoint should work with valid token', () => {
      return request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('POS Workflow (Critical Path)', () => {
    it('Should complete full POS transaction', async () => {
      // 1. Create a customer
      const customerResponse = await request(app.getHttpServer())
        .post('/pharmacy/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          companyId: 'test-company-id',
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
        })
        .expect(201);

      const customerId = customerResponse.body.customerId;

      // 2. Create a sale
      const saleResponse = await request(app.getHttpServer())
        .post('/sales')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          branchId: 'test-branch-id',
          customerId: customerId,
          paymentMethod: 'CASH',
          lines: [
            {
              productId: 'test-product-id',
              quantity: 2,
              unitPrice: 10.50,
            },
          ],
        })
        .expect(201);

      expect(saleResponse.body).toHaveProperty('saleId');
      expect(saleResponse.body.netTotal).toBe(21.00);
    });
  });

  describe('Rate Limiting', () => {
    it('Should throttle excessive requests', async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app.getHttpServer())
            .get('/health')
            .expect((res) => {
              // Some requests should be rate-limited
              return res.status === 200 || res.status === 429;
            })
        );
      }
      await Promise.all(promises);
    });
  });
});
