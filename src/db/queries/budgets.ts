import { db } from "@/db";
import { budgets } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NewBudget, Budget } from "@/types";

/**
 * Fetch all budgets for a specific user.
 */
export async function getBudgets(userId: string): Promise<Budget[]> {
  return db
    .select()
    .from(budgets)
    .where(eq(budgets.userId, userId));
}

/**
 * Fetch a single budget by ID.
 */
export async function getBudgetById(id: string, userId: string): Promise<Budget | undefined> {
  const [budget] = await db
    .select()
    .from(budgets)
    .where(
      and(
        eq(budgets.id, id),
        eq(budgets.userId, userId)
      )
    )
    .limit(1);
  return budget;
}

/**
 * Create a new budget.
 */
export async function createBudget(data: NewBudget): Promise<Budget[]> {
  return db.insert(budgets).values(data).returning();
}

/**
 * Update an existing budget.
 */
export async function updateBudget(
  id: string,
  userId: string,
  data: Partial<NewBudget>
): Promise<Budget[]> {
  return db
    .update(budgets)
    .set(data)
    .where(
      and(
        eq(budgets.id, id),
        eq(budgets.userId, userId)
      )
    )
    .returning();
}

/**
 * Delete a budget.
 */
export async function deleteBudget(id: string, userId: string): Promise<void> {
  await db
    .delete(budgets)
    .where(
      and(
        eq(budgets.id, id),
        eq(budgets.userId, userId)
      )
    )
    .execute();
}
