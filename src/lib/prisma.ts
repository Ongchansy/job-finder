import { PrismaClient } from '@prisma/client';

declare global {
  // Allow global `prisma` variable in Node.js
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ??
  new PrismaClient({
    // optional: log queries in development
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
