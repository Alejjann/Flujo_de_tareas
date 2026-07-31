import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const task = await prisma.task.create({
    data: {
      title: "Nueva tarea",
      description: "Creada desde la API",
    },
  });

  return NextResponse.json(task);
}