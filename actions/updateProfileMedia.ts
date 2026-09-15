"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en Vercel.");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function updateProfileMedia(formData: FormData) {
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

  let extension = "jpg";

  if (file.type === "image/png") {
    extension = "png";
  } else if (file.type === "image/webp") {
    extension = "webp";
  } else if (file.type === "image/jpeg") {
    extension = "jpg";
  }

  const filePath = `${type}s/${session.user.id}.${extension}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error: uploadError } = await supabase.storage
    .from("profiles")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("SUPABASE STORAGE ERROR:", uploadError);

    throw new Error(`Supabase: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from("profiles")
    .getPublicUrl(filePath);

  const imageUrl = data.publicUrl;

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