"use server";

import { auth } from "@/auth";
import { createBudget, updateBudget, deleteBudget } from "@/db/queries/budgets";
import { budgetSchema, BudgetFormValues } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createBudgetAction(values: BudgetFormValues) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validatedFields = budgetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  try {
    await createBudget({
      ...validatedFields.data,
      userId: session.user.id,
    });

    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to create budget:", error);
    return { error: "Database error" };
  }
}

export async function updateBudgetAction(id: string, values: Partial<BudgetFormValues>) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await updateBudget(id, session.user.id, values);
    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update budget:", error);
    return { error: "Database error" };
  }
}

export async function deleteBudgetAction(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await deleteBudget(id, session.user.id);
    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete budget:", error);
    return { error: "Database error" };
  }
}
