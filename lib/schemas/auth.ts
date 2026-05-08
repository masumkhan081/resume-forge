import { z } from 'zod';

export const emailField = z
  .string()
  .min(1, 'Email is required.')
  .email('Enter a valid email.');

export const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[A-Za-z]/, 'Password must include a letter.')
  .regex(/\d/, 'Password must include a number.');

export const confirmPasswordField = z
  .string()
  .min(8, 'Confirm your password.');

export const fullNameField = z.string().min(2, 'Enter your full name.');

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});
export type LoginInput = z.infer<typeof loginSchema>;

const signupBaseSchema = z.object({
  fullName: fullNameField,
  email: emailField,
  password: passwordField,
});
export const signupServerSchema = signupBaseSchema;
export type SignupServerInput = z.infer<typeof signupServerSchema>;

export const signupSchema = signupBaseSchema
  .extend({ confirmPassword: z.string().min(6, 'Confirm your password.') })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
export type SignupInput = z.infer<typeof signupSchema>;

export const recoverySchema = z.object({ email: emailField });
export type RecoveryInput = z.infer<typeof recoverySchema>;

export const resetSchema = z
  .object({
    token: z.string().min(1, 'This reset link is missing or invalid.'),
    password: passwordField,
    confirmPassword: confirmPasswordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
export type ResetInput = z.infer<typeof resetSchema>;

export const otpSchema = z.object({
  email: emailField,
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code.'),
});
export type OtpInput = z.infer<typeof otpSchema>;
