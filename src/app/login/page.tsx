
import AuthPageLayout from '@/components/layout/AuthPageLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Account Butler',
  description: 'Log in to your Account Butler account.',
};

export default function LoginPage() {
  return (
    <AuthPageLayout>
      <LoginForm />
    </AuthPageLayout>
  );
}
