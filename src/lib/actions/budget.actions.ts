"use server";

import { auth } from "@/auth";
import { createBudget, updateBudget, deleteBudget } from "@/db/queries/budgets";
import { getUserSettings } from "@/db/queries/user";
import { budgetSchema, BudgetFormValues } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { convertToPKR } from "@/lib/currencies";

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
    const settings = await getUserSettings(session.user.id);
    const amountInPKR = convertToPKR(parseFloat(validatedFields.data.limitAmount), settings.currency);

    await createBudget({
      ...validatedFields.data,
      limitAmount: amountInPKR.toString(),
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
    const settings = await getUserSettings(session.user.id);
    const updateData = { ...values };

    if (values.limitAmount) {
      updateData.limitAmount = convertToPKR(parseFloat(values.limitAmount), settings.currency).toString();
    }

    await updateBudget(id, session.user.id, updateData);
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
