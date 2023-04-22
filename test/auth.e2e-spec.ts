import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
describe('AuthController (e2e)', () => {
  const authUrl = 'http://localhost:3000/api/v1/auth';

  const mockRegisterUser = {
    firstName: 'test',
    lastName: 'test',
    email: 'email4@gmail.com',
    password: 'password',
  };

  const mockLoginUser = {
    email: 'email4@gmail.com',
    password: 'password',
  };

  describe('/register (POST)', () => {
    it('should register a user and return the new user object', async () => {
      const response = await request(authUrl)
        .post('/register')
        .send(mockRegisterUser);

      const { id, firstName, lastName, password, email, imagePath, role } =
        response.body;

      expect(typeof id).toBe('number');
      expect(firstName).toEqual(mockRegisterUser.firstName);
      expect(lastName).toEqual(mockRegisterUser.lastName);
      expect(email).toEqual(mockRegisterUser.email);
      expect(password).toBeUndefined();
      expect(imagePath).toBeNull();
      expect(role).toEqual('user');

      expect(response.status).toBe(HttpStatus.CREATED);
      // expect(response.body).toHaveProperty('accessToken');
    });

    it('it should not register a new user if the passed email already exists', () => {
      return request(authUrl)
        .post('/register')
        .set('Accept', 'application/json')
        .send(mockRegisterUser)
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('/login (POST)', () => {
    it('it should not log in nor return a JWT for an unregistered user', () => {
      return request(authUrl)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ email: 'doesnot@exist.com', password: 'password' })
        .expect((response: request.Response) => {
          const { token }: { token: string } = response.body;

          expect(token).toBeUndefined();
        })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('it should log in and return a JWT for a registered user', () => {
      return request(authUrl)
        .post('/login')
        .set('Accept', 'application/json')
        .send(mockLoginUser)
        .expect((response: request.Response) => {
          const { token }: { token: string } = response.body;

          expect(jwt.verify(token, 'secret')).toBeTruthy();
        })
        .expect(HttpStatus.OK);
    });
  });
});
