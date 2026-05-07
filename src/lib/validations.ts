import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  note: z.string().max(255, "Note must be under 255 characters").optional().nullable(),
  categoryId: z.string().uuid("Invalid category selected").optional().nullable(),
  date: z.string().or(z.date()).transform((val) => new Date(val)),
  isRecurring: z.boolean().default(false),
  frequency: z.string().optional().nullable(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color hex").optional().nullable(),
  icon: z.string().optional().nullable(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const budgetSchema = z.object({
  categoryId: z.string().uuid("Invalid category selected"),
  limitAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Limit must be a positive number",
  }),
  period: z.enum(["monthly", "yearly"]).default("monthly"),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;
