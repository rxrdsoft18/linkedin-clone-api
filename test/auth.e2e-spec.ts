import * as request from 'supertest';
describe('AuthController (e2e)', () => {
  const authUrl = 'http://localhost:3000/api/v1/auth';

  const mockRegisterUser = {
    firstName: 'test',
    lastName: 'test',
    email: 'email2@gmail.com',
    password: 'password',
  };

  describe('/register (POST)', () => {
    it('should register a user and return the new user object', async () => {
      const response = await request(authUrl)
        .post('/register')
        .send(mockRegisterUser);

      const { id, firstName, lastName, password, email, imagePath, role } =
        response.body;

      console.log(response.body);

      expect(typeof id).toBe('number');
      expect(firstName).toEqual(mockRegisterUser.firstName);
      expect(lastName).toEqual(mockRegisterUser.lastName);
      expect(email).toEqual(mockRegisterUser.email);
      expect(password).toBeUndefined();
      expect(imagePath).toBeNull();
      expect(role).toEqual('user');



      // expect(response.status).toBe(201);
      // expect(response.body).toHaveProperty('accessToken');
    });
  });
});
