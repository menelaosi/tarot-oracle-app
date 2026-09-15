import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError } from './http-error.js';

process.env.GOOGLE_CLIENT_ID = 'test-client-id';

const verifyIdToken = vi.fn();
vi.mock('google-auth-library', () => ({
  // A regular function, not an arrow function — arrow functions have no
  // [[Construct]] and can't be called with `new`, which google-auth.ts does.
  OAuth2Client: vi.fn().mockImplementation(function MockOAuth2Client() {
    return { verifyIdToken };
  }),
}));

const { verifyGoogleIdToken } = await import('./google-auth.js');

beforeEach(() => {
  verifyIdToken.mockReset();
});

describe('verifyGoogleIdToken', () => {
  it('extracts identity fields, coalescing a missing name/picture to null', async () => {
    verifyIdToken.mockResolvedValueOnce({
      getPayload: () => ({ sub: 'google-user-1', email: 'a@b.com' }),
    });
    await expect(verifyGoogleIdToken('token')).resolves.toEqual({
      providerId: 'google-user-1',
      email: 'a@b.com',
      displayName: null,
      avatarUrl: null,
    });
  });

  it('passes through a present name/picture', async () => {
    verifyIdToken.mockResolvedValueOnce({
      getPayload: () => ({
        sub: 'google-user-1',
        email: 'a@b.com',
        name: 'A B',
        picture: 'https://example.com/a.png',
      }),
    });
    await expect(verifyGoogleIdToken('token')).resolves.toEqual({
      providerId: 'google-user-1',
      email: 'a@b.com',
      displayName: 'A B',
      avatarUrl: 'https://example.com/a.png',
    });
  });

  it('throws a 400 when the token fails verification', async () => {
    verifyIdToken.mockRejectedValueOnce(new Error('invalid token'));
    await expect(verifyGoogleIdToken('bad-token')).rejects.toBeInstanceOf(HttpError);

    verifyIdToken.mockRejectedValueOnce(new Error('invalid token'));
    await expect(verifyGoogleIdToken('bad-token')).rejects.toMatchObject({ status: 400 });
  });

  it('throws a 400 when the payload is missing sub', async () => {
    verifyIdToken.mockResolvedValueOnce({ getPayload: () => ({ email: 'a@b.com' }) });
    await expect(verifyGoogleIdToken('token')).rejects.toMatchObject({ status: 400 });
  });

  it('throws a 400 when the payload is missing email', async () => {
    verifyIdToken.mockResolvedValueOnce({ getPayload: () => ({ sub: 'google-user-1' }) });
    await expect(verifyGoogleIdToken('token')).rejects.toMatchObject({ status: 400 });
  });

  it('throws a 400 when getPayload returns undefined', async () => {
    verifyIdToken.mockResolvedValueOnce({ getPayload: () => undefined });
    await expect(verifyGoogleIdToken('token')).rejects.toMatchObject({ status: 400 });
  });
});
