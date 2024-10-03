import request from 'supertest';
import app from '../../index';
import { authController } from '../../controllers/authController';

describe('POST /login', () => {
  it('should return a valid JWT token for correct credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ identificativo: 'BVLOVD43P99ALSJD' });

    // Verifica che lo status code sia 200
    expect(response.status).toBe(200);

    // Verifica che la risposta contenga un token
    const token = response.body.token;
    expect(token).toBeDefined();

    // Verifica che il token sia un JWT valido
    const decoded = authController.verifyToken(token);
    expect((decoded as any).id_utente).toBe(2);
  });

  it('should return 401 for incorrect credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ identificativo: 'wrongpassword' });

    // Verifica che lo status code sia 401 per credenziali errate
    expect(response.status).toBe(401);
    expect(response.body.error.message).toBe('Credenziali non valide');
  });
});
