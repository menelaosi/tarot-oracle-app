import { describe, expect, it } from 'vitest';
import type { SessionUserRow } from './sessions.js';
import { toUserDto } from './users.js';

describe('toUserDto', () => {
  it('remaps snake_case fields to camelCase', () => {
    expect(
      toUserDto({ id: 'u1', email: 'a@b.com', display_name: 'A B', avatar_url: 'https://x' }),
    ).toEqual({ id: 'u1', email: 'a@b.com', displayName: 'A B', avatarUrl: 'https://x' });
  });

  it('passes through null display name/avatar', () => {
    expect(toUserDto({ id: 'u1', email: 'a@b.com', display_name: null, avatar_url: null })).toEqual(
      { id: 'u1', email: 'a@b.com', displayName: null, avatarUrl: null },
    );
  });

  it('accepts the wider SessionUserRow shape too (an extra session_id field is fine)', () => {
    const row: SessionUserRow = {
      session_id: 's1',
      id: 'u1',
      email: 'a@b.com',
      display_name: null,
      avatar_url: null,
    };
    expect(toUserDto(row)).toEqual({
      id: 'u1',
      email: 'a@b.com',
      displayName: null,
      avatarUrl: null,
    });
  });
});
