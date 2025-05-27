
export interface User {
  id: string;
  email: string;
}

export interface Account {
  id: string;
  name: string;
  description?: string; // Used for AI categorization
  email?: string;
  phoneNumber?: string;
  password?: string; // Will be stored/handled as masked
  category?: string;
  categoryConfidence?: number;
  createdAt: string; // ISO date string
}
