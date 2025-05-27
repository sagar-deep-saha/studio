
"use client";

import type { ColumnDef } from "@tanstack/react-table"; // Assuming you might use @tanstack/react-table later
import type { Account } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Trash2, Edit3, Eye, EyeOff, Mail, Phone, KeyRound, Tag, ShieldQuestion, Briefcase, ShoppingCart, Users, Landmark } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

const categoryIcons: { [key: string]: React.ElementType } = {
  "Email": Mail,
  "Work": Briefcase,
  "Social": Users,
  "Finance": Landmark,
  "Shopping": ShoppingCart,
  "Security": KeyRound,
  "Default": Tag,
};

const getCategoryIcon = (category?: string) => {
  if (!category) return ShieldQuestion;
  const categoryKey = Object.keys(categoryIcons).find(key => category.toLowerCase().includes(key.toLowerCase()));
  return categoryKey ? categoryIcons[categoryKey] : ShieldQuestion;
};


export const staticColumns = (
    onEdit: (account: Account) => void,
    onDelete: (accountId: string) => void,
    togglePasswordVisibility: (accountId: string) => void,
    isPasswordVisible: (accountId: string) => boolean
  ): ColumnDef<Account>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Account Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email") || <span className="text-muted-foreground italic">N/A</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => row.getValue("phoneNumber") || <span className="text-muted-foreground italic">N/A</span>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string | undefined;
      const Icon = getCategoryIcon(category);
      return category ? (
        <Badge variant="outline" className="flex items-center gap-1.5 capitalize">
          <Icon className="h-3.5 w-3.5" />
          {category}
        </Badge>
      ) : (
        <span className="text-muted-foreground italic">Uncategorized</span>
      );
    },
  },
  {
    accessorKey: "password",
    header: "Password",
    cell: ({ row }) => {
      const accountId = row.original.id;
      const visible = isPasswordVisible(accountId);
      return (
        <div className="flex items-center space-x-2">
          <span>{visible ? row.original.password : "••••••••"}</span>
          <Button variant="ghost" size="icon" onClick={() => togglePasswordVisibility(accountId)} className="h-7 w-7">
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Added",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const account = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(account)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(account.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
