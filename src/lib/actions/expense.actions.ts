"use server";

import { auth } from "@/auth";
import { createExpense, updateExpense, deleteExpense } from "@/db/queries/expenses";
import { expenseSchema, ExpenseFormValues } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createExpenseAction(values: ExpenseFormValues) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Validate the data again on the server
  const validatedFields = expenseSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  try {
    await createExpense({
      ...validatedFields.data,
      userId: session.user.id,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to create expense:", error);
    return { error: "Database error" };
  }
}

export async function updateExpenseAction(id: string, values: Partial<ExpenseFormValues>) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await updateExpense(id, session.user.id, values);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update expense:", error);
    return { error: "Database error" };
  }
}

export async function deleteExpenseAction(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await deleteExpense(id, session.user.id);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete expense:", error);
    return { error: "Database error" };
  }
}
