"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function updateProfileMedia(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No estás autenticado");
  }

  const file = formData.get("file") as File | null;
  const type = formData.get("type") as
    | "avatar"
    | "banner";

  if (!file) {
    throw new Error("No se ha seleccionado ninguna imagen");
  }

  if (type !== "avatar" && type !== "banner") {
    throw new Error("Tipo de imagen no válido");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("La imagen no puede superar los 5 MB");
  }

  const extension =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
      ? "webp"
      : "jpg";

  const fileName = `${session.user.id}-${type}.${extension}`;

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "profiles"
  );

  await fs.mkdir(uploadDir, {
    recursive: true,
  });

  const filePath = path.join(
    uploadDir,
    fileName
  );

  const bytes = await file.arrayBuffer();

  await fs.writeFile(
    filePath,
    Buffer.from(bytes)
  );

  const imageUrl =
    `/uploads/profiles/${fileName}`;

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data:
      type === "avatar"
        ? {
            avatarUrl: imageUrl,
          }
        : {
            bannerUrl: imageUrl,
          },
  });

  revalidatePath("/profile");
  revalidatePath("/");
}