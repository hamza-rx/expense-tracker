import { auth } from "@/auth";
import { updateBudget, deleteBudget } from "@/db/queries/budgets";
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
    const [updatedBudget] = await updateBudget(id, session.user.id, body);

    if (!updatedBudget) {
      return NextResponse.json({ error: "Budget not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(updatedBudget);
  } catch (error) {
    console.error("Error updating budget:", error);
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
    await deleteBudget(id, session.user.id);
    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
