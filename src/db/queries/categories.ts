import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { NewCategory, Category } from "@/types";

/**
 * Fetch all categories for a specific user, ordered by name.
 */
export async function getCategories(userId: string): Promise<Category[]> {
  return db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(asc(categories.name));
}

/**
 * Fetch a single category by ID, ensuring it belongs to the user.
 */
export async function getCategoryById(id: string, userId: string): Promise<Category | undefined> {
  const [category] = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.id, id),
        eq(categories.userId, userId)
      )
    )
    .limit(1);
  return category;
}

/**
 * Create a new category.
 */
export async function createCategory(data: NewCategory): Promise<Category[]> {
  return db.insert(categories).values(data).returning();
}

/**
 * Update an existing category.
 */
export async function updateCategory(
  id: string,
  userId: string,
  data: Partial<NewCategory>
): Promise<Category[]> {
  return db
    .update(categories)
    .set(data)
    .where(
      and(
        eq(categories.id, id),
        eq(categories.userId, userId)
      )
    )
    .returning();
}

/**
 * Delete a category.
 */
export async function deleteCategory(id: string, userId: string): Promise<void> {
  await db
    .delete(categories)
    .where(
      and(
        eq(categories.id, id),
        eq(categories.userId, userId)
      )
    )
    .execute();
}
