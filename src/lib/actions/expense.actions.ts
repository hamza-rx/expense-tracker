"use server";

import { auth } from "@/auth";
import { createExpense, updateExpense, deleteExpense } from "@/db/queries/expenses";
import { getUserSettings } from "@/db/queries/user";
import { expenseSchema, ExpenseFormValues } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { convertToPKR } from "@/lib/currencies";

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
    const settings = await getUserSettings(session.user.id);
    const amountInPKR = convertToPKR(parseFloat(validatedFields.data.amount), settings.currency);

    await createExpense({
      ...validatedFields.data,
      amount: amountInPKR.toString(),
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
    const settings = await getUserSettings(session.user.id);
    const updateData = { ...values };

    if (values.amount) {
      updateData.amount = convertToPKR(parseFloat(values.amount), settings.currency).toString();
    }

    await updateExpense(id, session.user.id, updateData);
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
