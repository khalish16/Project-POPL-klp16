import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getSet(id: number, userId: number) {
  return prisma.exerciseSet.findFirst({
    where: {
      id,
      exercise: {
        workout: {
          userId,
        },
      },
    },
  });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const u = await requireUser();
    const { id } = await params;

    const s = await getSet(Number(id), u.id);

    if (!s) {
      return NextResponse.json(
        { message: "Set tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.exerciseSet.delete({
      where: {
        id: s.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message },
      { status: 400 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const u = await requireUser();
    const { id } = await params;

    const s = await getSet(Number(id), u.id);

    if (!s) {
      return NextResponse.json(
        { message: "Set tidak ditemukan." },
        { status: 404 }
      );
    }

    const d = await req.json();

    return NextResponse.json(
      await prisma.exerciseSet.update({
        where: {
          id: s.id,
        },
        data: {
          weight: Number(d.weight),
          reps: Number(d.reps),
          note: d.note,
        },
      })
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message },
      { status: 400 }
    );
  }
}