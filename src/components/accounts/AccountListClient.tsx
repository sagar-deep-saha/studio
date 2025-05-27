
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Account } from '@/types';
import { categorizeAccounts, type CategorizeAccountsInput } from '@/ai/flows/categorize-accounts';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { staticColumns } from './AccountColumns'; // Assuming Tanstack Table might be integrated later
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image'; // For placeholder image

const accountSchema = z.object({
  name: z.string().min(1, "Account name is required."),
  description: z.string().optional(),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  phoneNumber: z.string().optional(),
  password: z.string().min(1, "Password is required."),
});

type AccountFormValues = z.infer<typeof accountSchema>;

const ACCOUNTS_STORAGE_KEY = 'account-butler-accounts';

export default function AccountListClient() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      description: '',
      email: '',
      phoneNumber: '',
      password: '',
    },
  });

  useEffect(() => {
    try {
      const storedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (storedAccounts) {
        setAccounts(JSON.parse(storedAccounts));
      }
    } catch (error) {
      console.error("Failed to load accounts from localStorage", error);
      localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);
  
  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return accounts;
    return accounts.filter(acc => 
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.email && acc.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (acc.category && acc.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [accounts, searchTerm]);

  const handleAddOrUpdateAccount = async (data: AccountFormValues) => {
    form.clearErrors();
    try {
      const aiInput: CategorizeAccountsInput = {
        accountName: data.name,
        accountDescription: data.description || data.name, // Fallback to name if description is empty
      };
      const categorizationResult = await categorizeAccounts(aiInput);

      if (editingAccount) {
        // Update existing account
        setAccounts(prevAccounts =>
          prevAccounts.map(acc =>
            acc.id === editingAccount.id
              ? {
                  ...acc,
                  ...data,
                  category: categorizationResult.category,
                  categoryConfidence: categorizationResult.confidence,
                }
              : acc
          )
        );
        toast({ title: "Account Updated", description: `"${data.name}" has been updated.` });
      } else {
        // Add new account
        const newAccount: Account = {
          id: Date.now().toString(),
          ...data,
          category: categorizationResult.category,
          categoryConfidence: categorizationResult.confidence,
          createdAt: new Date().toISOString(),
        };
        setAccounts(prevAccounts => [newAccount, ...prevAccounts]);
        toast({ title: "Account Added", description: `"${data.name}" categorized as ${categorizationResult.category}.` });
      }
      
      form.reset();
      setEditingAccount(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error categorizing account:", error);
      toast({
        title: "Error",
        description: "Could not categorize or save the account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    form.reset({
      name: account.name,
      description: account.description || '',
      email: account.email || '',
      phoneNumber: account.phoneNumber || '',
      password: account.password || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (accountId: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    toast({ title: "Account Deleted", description: "The account has been removed.", variant: "destructive" });
  };

  const togglePasswordVisibility = (accountId: string) => {
    setVisiblePasswords(prev => ({ ...prev, [accountId]: !prev[accountId] }));
  };

  const isPasswordVisible = (accountId: string) => !!visiblePasswords[accountId];

  const columns = useMemo(() => staticColumns(handleEdit, handleDelete, togglePasswordVisibility, isPasswordVisible), [accounts, visiblePasswords]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">My Accounts</h2>
          <p className="text-muted-foreground">
            Manage and organize your online accounts securely.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          if (!isOpen) {
            form.reset();
            setEditingAccount(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{editingAccount ? "Edit Account" : "Add New Account"}</DialogTitle>
              <DialogDescription>
                {editingAccount ? "Update the details for this account." : "Fill in the details for your new account. AI will help categorize it."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleAddOrUpdateAccount)} className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Account Name</Label>
                <Input id="name" {...form.register("name")} placeholder="e.g., Google, Netflix" className="mt-1" />
                {form.formState.errors.name && <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">Description (for AI categorization)</Label>
                <Input id="description" {...form.register("description")} placeholder="e.g., Primary email and cloud storage" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} placeholder="user@example.com" className="mt-1" />
                 {form.formState.errors.email && <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input id="phoneNumber" {...form.register("phoneNumber")} placeholder="+1234567890" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...form.register("password")} placeholder="••••••••" className="mt-1" />
                {form.formState.errors.password && <p className="text-sm text-destructive mt-1">{form.formState.errors.password.message}</p>}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (editingAccount ? 'Updating...' : 'Adding...') : (editingAccount ? "Save Changes" : "Add Account")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search accounts (name, email, category...)" 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredAccounts.length > 0 ? (
        <ScrollArea className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id || column.accessorKey as string}>
                    {typeof column.header === 'function' ? column.header({ column } as any) : column.header as React.ReactNode}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id || column.accessorKey as string}>
                      {typeof column.cell === 'function' ? column.cell({ row: { original: account, getValue: (key: string) => account[key as keyof Account], getIsSelected: () => false, toggleSelected: () => {} } } as any) : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="h-[calc(100vh-400px)]" /> {/* Adjust height for scroll */}
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-12 text-center min-h-[300px]">
            <Image src="https://placehold.co/300x200.png" alt="No accounts" width={200} height={133} className="mb-6 rounded opacity-50" data-ai-hint="empty state illustration" />
            <h3 className="text-xl font-semibold text-foreground">No Accounts Found</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              {searchTerm ? "Try adjusting your search or " : "Get started by "}
              <Button variant="link" className="p-0 h-auto" onClick={() => setIsDialogOpen(true)}>adding your first account</Button>.
            </p>
        </div>
      )}
    </div>
  );
}

