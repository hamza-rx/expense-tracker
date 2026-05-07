import { db } from "@/db";
import { expenses, categories, budgets } from "@/db/schema";
import { eq, and, sql, desc, gte, lte, asc } from "drizzle-orm";

/**
 * Get total spending grouped by category for a specific time range.
 */
export async function getSpendingByCategory(
  userId: string,
  startDate?: Date,
  endDate?: Date
) {
  const query = db
    .select({
      categoryId: expenses.categoryId,
      categoryName: categories.name,
      categoryColor: categories.color,
      totalAmount: sql<number>`sum(${expenses.amount})::float`,
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(
      and(
        eq(expenses.userId, userId),
        startDate ? gte(expenses.date, startDate) : undefined,
        endDate ? lte(expenses.date, endDate) : undefined
      )
    )
    .groupBy(expenses.categoryId, categories.name, categories.color)
    .orderBy(desc(sql`sum(${expenses.amount})`));

  return query;
}

/**
 * Get a summary of spending vs budget for the current month.
 */
export async function getBudgetStatus(userId: string) {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch all budgets for the user
  const userBudgets = await db
    .select({
      id: budgets.id,
      categoryId: budgets.categoryId,
      categoryName: categories.name,
      limitAmount: budgets.limitAmount,
    })
    .from(budgets)
    .leftJoin(categories, eq(budgets.categoryId, categories.id))
    .where(eq(budgets.userId, userId));

  // Fetch spending per category for the current month
  const spending = await db
    .select({
      categoryId: expenses.categoryId,
      totalSpent: sql<number>`sum(${expenses.amount})::float`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, firstDayOfMonth)
      )
    )
    .groupBy(expenses.categoryId);

  // Merge the data
  const status = userBudgets.map((b) => {
    const spent = spending.find((s) => s.categoryId === b.categoryId)?.totalSpent || 0;
    return {
      ...b,
      spent,
      remaining: parseFloat(b.limitAmount) - spent,
      percentUsed: (spent / parseFloat(b.limitAmount)) * 100,
    };
  });

  return status;
}

/**
 * Get monthly spending totals for the last 6 months for trends.
 */
export async function getMonthlyTrends(userId: string) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return db
    .select({
      month: sql<string>`to_char(${expenses.date}, 'YYYY-MM')`,
      totalAmount: sql<number>`sum(${expenses.amount})::float`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, sixMonthsAgo)
      )
    )
    .groupBy(sql`to_char(${expenses.date}, 'YYYY-MM')`)
    .orderBy(asc(sql`to_char(${expenses.date}, 'YYYY-MM')`));
}
