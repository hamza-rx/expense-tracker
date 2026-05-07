import { auth } from "@/auth";
import { getExpenses } from "@/db/queries/expenses";
import { getCategories } from "@/db/queries/categories";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const [expenses, categories] = await Promise.all([
      getExpenses(userId),
      getCategories(userId)
    ]);

    const categoryMap = new Map(categories.map(c => [c.id, c.name]));

    // CSV Header
    let csv = "Date,Category,Amount,Note,Recurring\n";

    // CSV Rows
    expenses.forEach((exp) => {
      const date = format(new Date(exp.date), "yyyy-MM-dd");
      const category = exp.categoryId ? categoryMap.get(exp.categoryId) || "Unknown" : "Uncategorized";
      const amount = exp.amount;
      const note = exp.note ? `"${exp.note.replace(/"/g, '""')}"` : ""; // Escape quotes for CSV
      const recurring = exp.isRecurring ? "Yes" : "No";

      csv += `${date},${category},${amount},${note},${recurring}\n`;
    });

    // Return as a downloadable file
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="expenses_export.csv"',
      },
    });

  } catch (error) {
    console.error("Error exporting CSV:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
