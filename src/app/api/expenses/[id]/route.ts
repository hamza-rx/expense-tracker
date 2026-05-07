import { auth } from "@/auth";
import { updateExpense, deleteExpense } from "@/db/queries/expenses";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Prepare update data, ensuring the date is a Date object if provided
    const updateData = {
      ...body,
      ...(body.date && { date: new Date(body.date) }),
    };

    const [updatedExpense] = await updateExpense(id, session.user.id, updateData);

    if (!updatedExpense) {
      return NextResponse.json({ error: "Expense not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteExpense(id, session.user.id);
    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
