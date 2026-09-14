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
    throw new Error("No estás autenticado.");
  }

  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string;

  if (!file || file.size === 0) {
    throw new Error("No se ha seleccionado ninguna imagen.");
  }

  if (type !== "avatar" && type !== "banner") {
    throw new Error("Tipo de imagen no válido.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen.");
  }

 if (file.size > 10 * 1024 * 1024) {
  throw new Error("La imagen no puede superar los 10 MB.");
}

  // Extensión segura según el tipo MIME
  let extension = "jpg";

  if (file.type === "image/png") {
    extension = "png";
  } else if (file.type === "image/webp") {
    extension = "webp";
  } else if (
    file.type === "image/jpeg"
  ) {
    extension = "jpg";
  }

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
  const buffer = Buffer.from(bytes);

  await fs.writeFile(
    filePath,
    buffer
  );

  const imageUrl =
    `/uploads/profiles/${fileName}`;

  if (type === "avatar") {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        avatarUrl: imageUrl,
      },
    });
  } else {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        bannerUrl: imageUrl,
      },
    });
  }

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  revalidatePath("/dashboard");
  revalidatePath("/");

  return {
    success: true,
    url: imageUrl,
  };
}