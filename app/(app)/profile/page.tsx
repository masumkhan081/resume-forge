import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/get-session';
import { Card } from '@/components/ui/card';
import { ProfileNameForm } from '@/components/profile/profile-name-form';
import { ChangePasswordForm } from '@/components/profile/change-password-form';
import { DeleteAccountForm } from '@/components/profile/delete-account-form';

export const metadata: Metadata = {
  title: 'Profile & security',
  description: 'Manage your name, password, and account.',
};

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/auth/login?next=/profile');

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
          Account
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
          Profile & security
        </h1>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Signed in as <span className="font-medium text-ink">{session.email}</span>.
        </p>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-ink">Display name</h2>
        <p className="mt-1 text-sm text-slate-600">
          Shown in the app shell. Not the same as the name on the resume itself.
        </p>
        <div className="mt-4">
          <ProfileNameForm initialName={session.fullName} />
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-ink">Password</h2>
        <p className="mt-1 text-sm text-slate-600">
          Changing your password signs you out of every other device.
        </p>
        <div className="mt-4">
          <ChangePasswordForm />
        </div>
      </Card>

      <Card className="border-rose-200 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-rose-700">Danger zone</h2>
        <div className="mt-4">
          <DeleteAccountForm email={session.email} />
        </div>
      </Card>
    </main>
  );
}
