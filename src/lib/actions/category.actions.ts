"use server";

import { auth } from "@/auth";
import { createCategory, updateCategory, deleteCategory } from "@/db/queries/categories";
import { categorySchema, CategoryFormValues } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(values: CategoryFormValues) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validatedFields = categorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  try {
    await createCategory({
      ...validatedFields.data,
      userId: session.user.id,
    });

    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/expenses");
    return { success: true };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { error: "Database error" };
  }
}

export async function updateCategoryAction(id: string, values: Partial<CategoryFormValues>) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await updateCategory(id, session.user.id, values);
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/expenses");
    return { success: true };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { error: "Database error" };
  }
}

export async function deleteCategoryAction(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await deleteCategory(id, session.user.id);
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/expenses");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { error: "Database error" };
  }
}
