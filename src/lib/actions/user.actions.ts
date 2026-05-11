"use server";

import { auth } from "@/auth";
import { updateUserSettings } from "@/db/queries/user";
import { revalidatePath } from "next/cache";

export async function updateCurrencyAction(currency: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await updateUserSettings(session.user.id, { currency });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update currency:", error);
    return { error: "Database error" };
  }
}
