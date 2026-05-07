import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import * as schema from '@/db/schema';

// --- Database Models (Inferred) ---

export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

export type Category = InferSelectModel<typeof schema.categories>;
export type NewCategory = InferInsertModel<typeof schema.categories>;

export type Expense = InferSelectModel<typeof schema.expenses>;
export type NewExpense = InferInsertModel<typeof schema.expenses>;

export type Budget = InferSelectModel<typeof schema.budgets>;
export type NewBudget = InferInsertModel<typeof schema.budgets>;

// --- Explicit Interfaces (For documentation and UI) ---

export interface UserProfile {
  id: string;
  email: string;
  emailVerified: Date | null;
  name: string | null;
  image: string | null;
  createdAt: Date | null;
}

export interface CategoryItem {
  id: string;
  userId: string | null;
  name: string;
  color: string | null;
  icon: string | null;
}

export interface ExpenseRecord {
  id: string;
  userId: string | null;
  categoryId: string | null;
  amount: string; // numeric is returned as string
  note: string | null;
  date: Date;
  isRecurring: boolean | null;
  frequency: string | null;
  createdAt: Date | null;
}

export interface BudgetLimit {
  id: string;
  userId: string | null;
  categoryId: string | null;
  limitAmount: string;
  period: string | null;
}

// --- Auth Types ---
export type Account = InferSelectModel<typeof schema.accounts>;
export type Session = InferSelectModel<typeof schema.sessions>;
export type VerificationToken = InferSelectModel<typeof schema.verificationTokens>;
