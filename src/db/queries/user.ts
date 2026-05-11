import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserSettings(userId: string) {
  const [user] = await db
    .select({
      currency: users.currency,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
    
  return user || { currency: 'USD' };
}

export async function updateUserSettings(userId: string, data: { currency: string }) {
  return db
    .update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning();
}
