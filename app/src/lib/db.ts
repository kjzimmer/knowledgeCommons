// app/src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;

/** True when a database is configured. Pages that read usage degrade gracefully without one (local preview). */
export function dbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
