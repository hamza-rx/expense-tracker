import { db } from "@/db";
import { expenses } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { NewExpense, Expense } from "@/types";

/**
 * Fetch all expenses for a specific user, ordered by date descending.
 */
export async function getExpenses(userId: string): Promise<Expense[]> {
  return db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.date));
}

/**
 * Fetch a single expense by ID, ensuring it belongs to the user.
 */
export async function getExpenseById(id: string, userId: string): Promise<Expense | undefined> {
  const [expense] = await db
    .select()
    .from(expenses)
    .where(
      and(
        eq(expenses.id, id),
        eq(expenses.userId, userId)
      )
    )
    .limit(1);
  return expense;
}

/**
 * Create a new expense record.
 */
export async function createExpense(data: NewExpense): Promise<Expense[]> {
  return db.insert(expenses).values(data).returning();
}

/**
 * Update an existing expense record.
 */
export async function updateExpense(
  id: string,
  userId: string,
  data: Partial<NewExpense>
): Promise<Expense[]> {
  return db
    .update(expenses)
    .set(data)
    .where(
      and(
        eq(expenses.id, id),
        eq(expenses.userId, userId)
      )
    )
    .returning();
}

/**
 * Delete an expense record.
 */
export async function deleteExpense(id: string, userId: string): Promise<void> {
  await db
    .delete(expenses)
    .where(
      and(
        eq(expenses.id, id),
        eq(expenses.userId, userId)
      )
    )
    .execute();
}
