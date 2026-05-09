import { describe, expect, it } from 'vitest';
import {
  changePasswordSchema,
  changePasswordServerSchema,
  updateNameSchema,
  deleteAccountSchema,
} from '@/lib/schemas/account';

describe('updateNameSchema', () => {
  it('rejects a single-character name', () => {
    expect(updateNameSchema.safeParse({ name: 'A' }).success).toBe(false);
  });

  it('accepts a valid name', () => {
    expect(updateNameSchema.safeParse({ name: 'Masum Khan' }).success).toBe(true);
  });
});

describe('changePasswordSchema', () => {
  it('rejects same current and new password', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'secret123',
      newPassword: 'secret123',
      confirmPassword: 'secret123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a confirm-mismatch', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'secret123',
      newPassword: 'newpass1',
      confirmPassword: 'mismatch',
    });
    expect(result.success).toBe(false);
  });

  it('accepts a valid change', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'secret123',
      newPassword: 'newpass1',
      confirmPassword: 'newpass1',
    });
    expect(result.success).toBe(true);
  });
});

describe('changePasswordServerSchema', () => {
  it('does not require confirmPassword', () => {
    expect(
      changePasswordServerSchema.safeParse({
        currentPassword: 'secret123',
        newPassword: 'newpass1',
      }).success,
    ).toBe(true);
  });
});

describe('deleteAccountSchema', () => {
  it('rejects empty confirmation', () => {
    expect(deleteAccountSchema.safeParse({ confirmation: '' }).success).toBe(false);
  });

  it('accepts non-empty confirmation', () => {
    expect(deleteAccountSchema.safeParse({ confirmation: 'me@example.com' }).success).toBe(true);
  });
});
