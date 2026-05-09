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

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/mongodb', () => ({
  connectMongo: vi.fn().mockResolvedValue(null),
}));

vi.mock('@/auth', () => ({
  signIn: vi.fn().mockResolvedValue(undefined),
  signOut: vi.fn().mockResolvedValue(undefined),
  auth: vi.fn().mockResolvedValue(null),
}));

vi.mock('@/lib/email', () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue({ ok: true }),
  sendPasswordResetEmail: vi.fn().mockResolvedValue({ ok: true }),
  sendPasswordChangedEmail: vi.fn().mockResolvedValue({ ok: true }),
  sendAccountDeletedEmail: vi.fn().mockResolvedValue({ ok: true }),
}));

vi.mock('@/lib/auth/password', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed-password'),
  verifyPassword: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn().mockReturnValue({ ok: true }),
}));

const userFindOne = vi.fn();
const userCreate = vi.fn();
const userUpdateOne = vi.fn();
const userFindById = vi.fn();
const userDeleteOne = vi.fn();

vi.mock('@/lib/models/user', () => ({
  User: {
    findOne: (...args: unknown[]) => userFindOne(...args),
    create: (...args: unknown[]) => userCreate(...args),
    updateOne: (...args: unknown[]) => userUpdateOne(...args),
    findById: (...args: unknown[]) => userFindById(...args),
    deleteOne: (...args: unknown[]) => userDeleteOne(...args),
  },
}));

const tokenFindOne = vi.fn();
const tokenDeleteMany = vi.fn();
const tokenDeleteOne = vi.fn();
const tokenCreate = vi.fn();

vi.mock('@/lib/models/password-reset-token', () => ({
  PasswordResetToken: {
    findOne: (...args: unknown[]) => tokenFindOne(...args),
    deleteMany: (...args: unknown[]) => tokenDeleteMany(...args),
    deleteOne: (...args: unknown[]) => tokenDeleteOne(...args),
    create: (...args: unknown[]) => tokenCreate(...args),
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
  loginAction,
  signupAction,
  requestPasswordRecovery,
  resetPasswordAction,
} from '@/lib/actions/session-actions';
import { signIn } from '@/auth';
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email';
import { verifyPassword } from '@/lib/auth/password';

const validSignup = {
  name: 'Alice',
  email: 'alice@example.com',
  password: 'secret123',
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

function leanResolve<T>(value: T) {
  return {
    select: () => ({ lean: () => Promise.resolve(value) }),
  };
}

describe('signupAction', () => {
  it('rejects malformed input', async () => {
    const result = await signupAction({ name: '', email: 'bad', password: 'short' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_INPUT');
  });

  it('rejects when an account already exists for the email', async () => {
    userFindOne.mockReturnValue(leanResolve({ _id: 'existing' }));
    const result = await signupAction(validSignup);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('EMAIL_TAKEN');
  });

  it('creates the user, signs in, and sends a welcome email', async () => {
    userFindOne.mockReturnValue(leanResolve(null));
    userCreate.mockResolvedValue({
      _id: { toString: () => 'user-1' },
      email: validSignup.email,
      name: validSignup.name,
    });

    const result = await signupAction(validSignup);
    expect(result.ok).toBe(true);
    expect(userCreate).toHaveBeenCalledTimes(1);
    expect(signIn).toHaveBeenCalledWith(
      'credentials',
      expect.objectContaining({ email: validSignup.email, redirect: false }),
    );
    expect(sendWelcomeEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: validSignup.email, fullName: validSignup.name }),
    );
  });
});

describe('loginAction', () => {
  it('rejects malformed input', async () => {
    const result = await loginAction({ email: 'not-an-email', password: 'short' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_INPUT');
  });

  it('passes credentials to Auth.js signIn on valid input', async () => {
    const result = await loginAction({
      email: 'alice@example.com',
      password: 'secret123',
    });
    expect(result.ok).toBe(true);
    expect(signIn).toHaveBeenCalledWith(
      'credentials',
      expect.objectContaining({ email: 'alice@example.com', redirect: false }),
    );
  });

  it('returns INVALID_CREDENTIALS when Auth.js throws CredentialsSignin', async () => {
    vi.mocked(signIn).mockRejectedValueOnce(new Error('CredentialsSignin'));
    const result = await loginAction({
      email: 'alice@example.com',
      password: 'secret123',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_CREDENTIALS');
  });
});

describe('requestPasswordRecovery', () => {
  it('returns the same generic success when the user does not exist (no enumeration)', async () => {
    userFindOne.mockReturnValue(leanResolve(null));
    const result = await requestPasswordRecovery({ email: 'unknown@example.com' });
    expect(result.ok).toBe(true);
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it('issues a token and sends an email when the user exists', async () => {
    userFindOne.mockReturnValue(
      leanResolve({ _id: { toString: () => 'u1' }, email: 'alice@example.com' }),
    );
    tokenDeleteMany.mockResolvedValue({});
    tokenCreate.mockResolvedValue({});

    const result = await requestPasswordRecovery({ email: 'alice@example.com' });
    expect(result.ok).toBe(true);
    expect(tokenCreate).toHaveBeenCalledTimes(1);
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'alice@example.com' }),
    );
  });
});

describe('resetPasswordAction', () => {
  it('rejects when the token has no DB record', async () => {
    tokenFindOne.mockReturnValue({ lean: () => Promise.resolve(null) });
    const result = await resetPasswordAction({
      token: 'a'.repeat(64),
      password: 'newpass1',
      confirmPassword: 'newpass1',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_RESET');
  });

  it('rejects when the token has expired', async () => {
    tokenFindOne.mockReturnValue({
      lean: () =>
        Promise.resolve({
          _id: 't1',
          userId: 'u1',
          tokenHash: 'h',
          expiresAt: new Date(Date.now() - 1000),
        }),
    });
    const result = await resetPasswordAction({
      token: 'a'.repeat(64),
      password: 'newpass1',
      confirmPassword: 'newpass1',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_RESET');
  });

  it('updates password and clears the token on a valid reset', async () => {
    tokenFindOne.mockReturnValue({
      lean: () =>
        Promise.resolve({
          _id: 't1',
          userId: { toString: () => 'u1' },
          tokenHash: 'h',
          expiresAt: new Date(Date.now() + 60_000),
        }),
    });
    userUpdateOne.mockReturnValue({ session: vi.fn().mockResolvedValue({}) });
    tokenDeleteOne.mockReturnValue({ session: vi.fn().mockResolvedValue({}) });

    const result = await resetPasswordAction({
      token: 'a'.repeat(64),
      password: 'newpass1',
      confirmPassword: 'newpass1',
    });
    expect(result.ok).toBe(true);
    expect(userUpdateOne).toHaveBeenCalled();
    expect(tokenDeleteOne).toHaveBeenCalled();
  });

  it('rejects mismatched confirmation locally', async () => {
    const result = await resetPasswordAction({
      token: 'a'.repeat(64),
      password: 'newpass1',
      confirmPassword: 'different',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_INPUT');
  });
});

// Suppress unused-import warnings for helpers we may want later.
void verifyPassword;
