
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sidebar, SidebarProvider, SidebarHeader, SidebarContent, 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, 
  SidebarInset, SidebarTrigger, SidebarFooter 
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ListChecks, LogOut, UserCircle, Settings } from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountsLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Logo className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-muted-foreground">Authenticating...</p>
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4 items-center">
          <Link href="/accounts" className="flex items-center gap-2 group">
            <Logo className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">Account Butler</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Accounts" isActive={router.pathname === '/accounts'}>
                <Link href="/accounts"><ListChecks /> <span className="group-data-[collapsible=icon]:hidden">Accounts</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Example for a future settings page
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings" isActive={router.pathname === '/accounts/settings'}>
                <Link href="#"><Settings /> <span className="group-data-[collapsible=icon]:hidden">Settings</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            */}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
           <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} tooltip="Logout" variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive">
                    <LogOut /> <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between p-4 border-b bg-card sticky top-0 z-10">
            <div className="md:hidden"> {/* Only show trigger on mobile (md and below) */}
                <SidebarTrigger />
            </div>
            <div className="flex-grow"></div> {/* Spacer */}
            <div className="flex items-center gap-3">
                <UserCircle className="h-7 w-7 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground hidden sm:inline">{user.email}</span>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
