
import AuthPageLayout from '@/components/layout/AuthPageLayout';
import { SignupForm } from '@/components/auth/SignupForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Account Butler',
  description: 'Create your Account Butler account.',
};

export default function SignupPage() {
  return (
    <AuthPageLayout>
      <SignupForm />
    </AuthPageLayout>
  );
}
