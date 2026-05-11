import { db } from "@/db";
import { expenses } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { addDays, addWeeks, addMonths, addYears, isBefore, isAfter, startOfDay } from "date-fns";

/**
 * Processes recurring expenses for a user and creates any due instances.
 */
export async function processRecurringExpenses(userId: string) {
  // 1. Fetch all recurring expenses for the user
  const recurringTemplates = await db
    .select()
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        eq(expenses.isRecurring, true)
      )
    )
    .orderBy(desc(expenses.date));

  if (recurringTemplates.length === 0) return;

  // 2. Group by "subscription" identity (note + amount + frequency + category)
  // We want to find the LATEST instance of each subscription
  const latestInstances = new Map<string, typeof expenses.$inferSelect>();
  
  for (const exp of recurringTemplates) {
    const key = `${exp.note}-${exp.amount}-${exp.frequency}-${exp.categoryId}`;
    if (!latestInstances.has(key)) {
      latestInstances.set(key, exp);
    }
  }

  const today = startOfDay(new Date());
  const newExpenses: (typeof expenses.$inferInsert)[] = [];

  // 3. For each latest instance, check if a new one is due
  for (const latest of latestInstances.values()) {
    if (!latest.frequency) continue;

    let nextDate = new Date(latest.date);
    
    // Calculate next date based on frequency
    const getNextDate = (d: Date, freq: string) => {
      switch (freq) {
        case 'daily': return addDays(d, 1);
        case 'weekly': return addWeeks(d, 1);
        case 'monthly': return addMonths(d, 1);
        case 'yearly': return addYears(d, 1);
        default: return addMonths(d, 1);
      }
    };

    nextDate = getNextDate(nextDate, latest.frequency);

    // Keep adding instances until we reach today
    while (isBefore(nextDate, today) || nextDate.getTime() === today.getTime()) {
      newExpenses.push({
        userId: latest.userId,
        categoryId: latest.categoryId,
        amount: latest.amount,
        note: latest.note,
        date: new Date(nextDate),
        isRecurring: true,
        frequency: latest.frequency,
      });

      nextDate = getNextDate(nextDate, latest.frequency);
    }
  }

  // 4. Batch insert new expenses if any
  if (newExpenses.length > 0) {
    await db.insert(expenses).values(newExpenses);
    console.log(`[Recurring] Created ${newExpenses.length} new expense instances for user ${userId}`);
  }
}
