import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(undefined),
    set: vi.fn(),
    delete: vi.fn(),
  }),
  headers: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(null),
  }),
}));

vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

vi.mock('@/lib/mongodb', () => ({
  connectMongo: vi.fn().mockResolvedValue(null),
}));

const authMock = vi.fn();

vi.mock('@/auth', () => ({
  auth: () => authMock(),
  signIn: vi.fn(),
  signOut: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/email', () => ({
  sendPasswordChangedEmail: vi.fn().mockResolvedValue({ ok: true }),
  sendAccountDeletedEmail: vi.fn().mockResolvedValue({ ok: true }),
}));

vi.mock('@/lib/auth/password', () => ({
  hashPassword: vi.fn().mockResolvedValue('new-hash'),
  verifyPassword: vi.fn().mockResolvedValue(true),
}));

const userFindById = vi.fn();
const userUpdateOne = vi.fn();
const userDeleteOne = vi.fn();

vi.mock('@/lib/models/user', () => ({
  User: {
    findById: (...args: unknown[]) => userFindById(...args),
    updateOne: (...args: unknown[]) => userUpdateOne(...args),
    deleteOne: (...args: unknown[]) => userDeleteOne(...args),
  },
}));

const resumeDeleteMany = vi.fn();
vi.mock('@/lib/models/resume', () => ({
  Resume: {
    deleteMany: (...args: unknown[]) => resumeDeleteMany(...args),
    findById: vi.fn(),
  },
}));

const tokenDeleteMany = vi.fn();
vi.mock('@/lib/models/password-reset-token', () => ({
  PasswordResetToken: {
    deleteMany: (...args: unknown[]) => tokenDeleteMany(...args),
  },
}));

vi.mock('mongoose', () => {
  class ObjectId {
    public value: string;
    constructor(value: string) {
      this.value = value;
    }
    toString() {
      return this.value;
    }
    static isValid(value: unknown) {
      return typeof value === 'string' && value.length > 0;
    }
  }
  const startSession = vi.fn().mockResolvedValue({
    withTransaction: async (fn: () => Promise<void>) => {
      await fn();
    },
    endSession: vi.fn().mockResolvedValue(undefined),
  });
  return {
    default: { startSession, Types: { ObjectId } },
    Types: { ObjectId },
    Schema: class MockSchema {
      static Types = { ObjectId: 'ObjectId', Mixed: 'Mixed' };
      index() {
        return this;
      }
    },
    model: vi.fn(),
    models: {},
    startSession,
  };
});

import {
  changePasswordAction,
  deleteAccountAction,
  updateProfileNameAction,
} from '@/lib/actions/account-actions';
import { sendPasswordChangedEmail, sendAccountDeletedEmail } from '@/lib/email';
import { verifyPassword } from '@/lib/auth/password';

const SESSION_USER = {
  user: { id: 'user-1', email: 'alice@example.com', name: 'Alice' },
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('updateProfileNameAction', () => {
  it('returns UNAUTHORIZED with no session', async () => {
    authMock.mockResolvedValueOnce(null);
    const result = await updateProfileNameAction({ name: 'Bob' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('UNAUTHORIZED');
  });

  it('updates the user record on success', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    userUpdateOne.mockResolvedValue({ acknowledged: true });
    const result = await updateProfileNameAction({ name: 'Alice Cooper' });
    expect(result.ok).toBe(true);
    expect(userUpdateOne).toHaveBeenCalled();
  });
});

describe('changePasswordAction', () => {
  it('returns UNAUTHORIZED without session', async () => {
    authMock.mockResolvedValueOnce(null);
    const result = await changePasswordAction({
      currentPassword: 'secret123',
      newPassword: 'newpass1',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('UNAUTHORIZED');
  });

  it('rejects when current password does not verify', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    userFindById.mockReturnValue({
      select: () => ({ lean: () => Promise.resolve({ _id: 'user-1', email: 'a', passwordHash: 'h' }) }),
    });
    vi.mocked(verifyPassword).mockResolvedValueOnce(false);

    const result = await changePasswordAction({
      currentPassword: 'wrongpass1',
      newPassword: 'newpass1',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('hashes the new password and emails the user on success', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    userFindById.mockReturnValue({
      select: () => ({ lean: () => Promise.resolve({ _id: { toString: () => 'user-1' }, email: 'alice@example.com', passwordHash: 'h' }) }),
    });
    userUpdateOne.mockResolvedValue({ acknowledged: true });

    const result = await changePasswordAction({
      currentPassword: 'secret123',
      newPassword: 'newpass1',
    });
    expect(result.ok).toBe(true);
    expect(userUpdateOne).toHaveBeenCalled();
    expect(sendPasswordChangedEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'alice@example.com' }),
    );
  });
});

describe('deleteAccountAction', () => {
  it('returns UNAUTHORIZED without session', async () => {
    authMock.mockResolvedValueOnce(null);
    const result = await deleteAccountAction({ confirmation: 'alice@example.com' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('UNAUTHORIZED');
  });

  it('rejects when confirmation does not match', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    const result = await deleteAccountAction({ confirmation: 'wrong@example.com' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('CONFIRMATION_MISMATCH');
  });

  it('cascades through resumes, sessions, tokens, and user, then emails confirmation', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    resumeDeleteMany.mockReturnValue({ session: vi.fn().mockResolvedValue({}) });
    tokenDeleteMany.mockReturnValue({ session: vi.fn().mockResolvedValue({}) });
    userDeleteOne.mockReturnValue({ session: vi.fn().mockResolvedValue({}) });

    const result = await deleteAccountAction({ confirmation: 'alice@example.com' });
    expect(result.ok).toBe(true);
    expect(resumeDeleteMany).toHaveBeenCalled();
    expect(tokenDeleteMany).toHaveBeenCalled();
    expect(userDeleteOne).toHaveBeenCalled();
    expect(sendAccountDeletedEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'alice@example.com' }),
    );
  });
});
