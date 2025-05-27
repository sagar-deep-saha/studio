
import AccountListClient from '@/components/accounts/AccountListClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Accounts - Account Butler',
  description: 'View and manage your accounts.',
};

export default function AccountsPage() {
  return (
    <AccountListClient />
  );
}
