
import React from 'react';
import { Logo } from '@/components/icons/Logo';

export default function AuthPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 selection:bg-accent/50 selection:text-accent-foreground">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold text-foreground">Account Butler</h1>
          <p className="text-muted-foreground">Your personal assistant for managing accounts.</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-lg sm:p-8">
          {children}
        </div>
         <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Account Butler. All rights reserved.
          </p>
      </div>
    </div>
  );
}
