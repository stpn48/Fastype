import { PrismaClient } from "@prisma/client/edge"; // Ensure we are using the edge client
import { withAccelerate } from "@prisma/extension-accelerate"; // Import the extension

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate()); // Add the extension here

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; // Ensure global prisma instance is set
