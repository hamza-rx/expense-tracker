import { auth } from "@/auth";
import { getExpenses, createExpense } from "@/db/queries/expenses";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const expenses = await getExpenses(session.user.id);
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
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
    
    // Ensure the expense is associated with the authenticated user
    const newExpenseData = {
      ...body,
      userId: session.user.id,
      // Convert date string to Date object if provided
      date: body.date ? new Date(body.date) : new Date(),
    };

    const [expense] = await createExpense(newExpenseData);
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
