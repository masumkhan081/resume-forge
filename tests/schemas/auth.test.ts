import { describe, expect, it } from 'vitest';
import {
  loginSchema,
  signupSchema,
  signupServerSchema,
  recoverySchema,
  resetSchema,
  otpSchema,
} from '@/lib/schemas/auth';

describe('loginSchema', () => {
  it('accepts a valid login', () => {
    const result = loginSchema.safeParse({ email: 'a@b.co', password: 'secret123' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret123' });
    expect(result.success).toBe(false);
  });

  it('rejects a short password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.co', password: 'abc' });
    expect(result.success).toBe(false);
  });
});

describe('signupSchema', () => {
  const valid = {
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'secret123',
    confirmPassword: 'secret123',
  };

  it('accepts a valid signup', () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = signupSchema.safeParse({ ...valid, confirmPassword: 'different1' });
    expect(result.success).toBe(false);
  });

  it('rejects a too-short name', () => {
    const result = signupSchema.safeParse({ ...valid, fullName: 'A' });
    expect(result.success).toBe(false);
  });
});

describe('signupServerSchema', () => {
  it('does not require confirmPassword', () => {
    const result = signupServerSchema.safeParse({
      fullName: 'Test User',
      email: 'a@b.co',
      password: 'secret123',
    });
    expect(result.success).toBe(true);
  });
});

describe('recoverySchema', () => {
  it('requires a valid email', () => {
    expect(recoverySchema.safeParse({ email: 'a@b.co' }).success).toBe(true);
    expect(recoverySchema.safeParse({ email: '' }).success).toBe(false);
  });
});

describe('resetSchema', () => {
  it('requires a token and matching passwords', () => {
    const ok = resetSchema.safeParse({
      token: 'abc',
      password: 'secret123',
      confirmPassword: 'secret123',
    });
    expect(ok.success).toBe(true);

    const noToken = resetSchema.safeParse({
      token: '',
      password: 'secret123',
      confirmPassword: 'secret123',
    });
    expect(noToken.success).toBe(false);

    const mismatch = resetSchema.safeParse({
      token: 'abc',
      password: 'secret123',
      confirmPassword: 'other-pass',
    });
    expect(mismatch.success).toBe(false);
  });
});

describe('otpSchema', () => {
  it('requires exactly 6 digits', () => {
    expect(otpSchema.safeParse({ email: 'a@b.co', code: '123456' }).success).toBe(true);
    expect(otpSchema.safeParse({ email: 'a@b.co', code: '12345' }).success).toBe(false);
    expect(otpSchema.safeParse({ email: 'a@b.co', code: 'abcdef' }).success).toBe(false);
  });
});
