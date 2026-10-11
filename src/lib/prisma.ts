import { PrismaClient } from "@prisma/client";

console.log("DATABASE_URL is defined:", !!process.env.DATABASE_URL);
console.log("Host:", process.env.DATABASE_URL?.split("@")[1]?.split("/")[0]);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: [] }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;