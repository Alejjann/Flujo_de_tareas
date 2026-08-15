"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export async function updateBanner(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No estás autenticado.");
  }

  const file = formData.get("banner") as File | null;

  if (!file || file.size === 0) {
    throw new Error("No se ha seleccionado ninguna imagen.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("La imagen no puede superar los 10 MB.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const extension = file.name.split(".").pop() || "jpg";

  const fileName = `banner-${session.user.id}-${Date.now()}.${extension}`;

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "banners"
  );

  await mkdir(uploadDir, {
    recursive: true,
  });

  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  const bannerUrl = `/uploads/banners/${fileName}`;

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bannerUrl,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  revalidatePath("/dashboard");
}