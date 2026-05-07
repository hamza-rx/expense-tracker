import { auth } from "@/auth";
import { getBudgets, createBudget } from "@/db/queries/budgets";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const budgets = await getBudgets(session.user.id);
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    const newBudgetData = {
      ...body,
      userId: session.user.id,
    };

    const [budget] = await createBudget(newBudgetData);
    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
