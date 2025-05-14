import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app';
import { User } from '../src/models/userModel';

describe('User Controller', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb');
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'test', email: 'test@mail.com', password: 'pass123' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should login and return a token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@mail.com', password: 'pass123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should get the user profile', async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'test@mail.com', password: 'pass123' });
    const token = loginRes.body.token;
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', 'test@mail.com');
  });
});

