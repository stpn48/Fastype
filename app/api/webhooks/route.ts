import { prisma } from "@/lib/prisma";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error("Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local");
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers yes
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { first_name, username, image_url, last_name } = evt.data;

    // create user in db
    await prisma.user.create({
      data: {
        firstName: first_name || "",
        lastName: last_name || "",
        username: username || "",
        imageUrl: image_url || "",
        clerkId: evt.data.id,
        stats: {
          create: {},
        },
      },
    });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    // delete user from db
    await prisma.user.delete({
      where: {
        clerkId: id,
      },
    });
  }

  if (eventType === "user.updated") {
    const { id, first_name, username, image_url, last_name } = evt.data;
    const userData = {
      firstName: first_name || "",
      lastName: last_name || "",
      username: username || "",
      imageUrl: image_url || "",
    };

    // update user in db
    await prisma.user.update({
      where: {
        clerkId: id,
      },
      data: {
        ...userData,
      },
    });
  }

  return new Response("Webhook received", { status: 200 });
}
