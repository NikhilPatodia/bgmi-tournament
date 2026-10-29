import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis;

/** Prisma Decimal instances cannot be structured-cloned by Better Auth sessions. */
function decimalToString(value) {
  if (value == null) return "0.00";
  if (typeof value === "object" && typeof value.toString === "function") {
    return value.toString();
  }
  return String(value);
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter }).$extends({
    result: {
      user: {
        depositBalance: {
          needs: { depositBalance: true },
          compute(user) {
            return decimalToString(user.depositBalance);
          },
        },
        winningBalance: {
          needs: { winningBalance: true },
          compute(user) {
            return decimalToString(user.winningBalance);
          },
        },
      },
    },
  });
}

const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
