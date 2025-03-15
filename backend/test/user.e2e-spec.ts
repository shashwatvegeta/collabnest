import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserType } from '../src/user/user.schema';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let userId: string;

  const testUser = {
    username: 'e2etestuser',
    password: 'testpassword123',
    email: 'e2e@test.com',
    roll_number: 'E2E123',
    user_type: UserType.STUDENT,
    student_skills: [],
    certificates: [],
    project_application: [],
    achievements: [],
    isVerified: false,
    notifications: [],
    projects: [],
    rating: 0
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = moduleFixture.get(getConnectionToken());
    await app.init();
  });

  afterAll(async () => {
    await connection.collection('users').deleteMany({});
    await connection.close();
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.username).toBe(testUser.username);
      expect(response.body.email).toBe(testUser.email);
      
      userId = response.body._id;
    });

    it('should not create a user with duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(testUser)
        .expect(400);
    });
  });

  describe('/users (GET)', () => {
    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('/users/:user_id (GET)', () => {
    it('should return a single user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      expect(response.body._id).toBe(userId);
      expect(response.body.username).toBe(testUser.username);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/users/non-existent-id')
        .expect(404);
    });
  });

  describe('/users/:user_id (PUT)', () => {
    it('should update a user', async () => {
      const updateData = {
        username: 'updateduser'
      };

      const response = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.username).toBe(updateData.username);
      expect(response.body._id).toBe(userId);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .put('/users/non-existent-id')
        .send({ username: 'test' })
        .expect(404);
    });
  });

  describe('/users/:user_id (DELETE)', () => {
    it('should delete a user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(200);

      // Verify user is deleted
      await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .delete('/users/non-existent-id')
        .expect(404);
    });
  });
}); 