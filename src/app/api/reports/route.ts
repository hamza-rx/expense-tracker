import { auth } from "@/auth";
import { getSpendingByCategory, getBudgetStatus, getMonthlyTrends } from "@/db/queries/reports";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "summary";
  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");

  try {
    const userId = session.user.id;

    if (type === "categories") {
      const startDate = startDateStr ? new Date(startDateStr) : undefined;
      const endDate = endDateStr ? new Date(endDateStr) : undefined;
      const data = await getSpendingByCategory(userId, startDate, endDate);
      return NextResponse.json(data);
    }

    if (type === "budget-status") {
      const data = await getBudgetStatus(userId);
      return NextResponse.json(data);
    }

    if (type === "trends") {
      const data = await getMonthlyTrends(userId);
      return NextResponse.json(data);
    }

    // Default: Return a summary of all three
    const [categories, budgetStatus, trends] = await Promise.all([
      getSpendingByCategory(userId),
      getBudgetStatus(userId),
      getMonthlyTrends(userId)
    ]);

    return NextResponse.json({
      categories,
      budgetStatus,
      trends
    });

  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
