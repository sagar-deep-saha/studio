
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton'; // Using Skeleton for a nicer loading state
import { Logo } from '@/components/icons/Logo';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/accounts');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-background">
      <Logo className="h-16 w-16 text-primary animate-pulse" />
      <p className="text-lg text-muted-foreground">Loading Account Butler...</p>
      <div className="w-1/2 max-w-md">
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
