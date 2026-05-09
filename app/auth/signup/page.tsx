import { isGoogleAuthEnabled } from '@/lib/env';
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return <SignupForm googleEnabled={isGoogleAuthEnabled} />;
}
