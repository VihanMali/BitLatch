import "server-only";
import { getDb } from "@/lib/db";

export async function listProjectsForUserId(userId) {
  const sql = getDb();
  return sql`
    SELECT id, name, created_at
    FROM projects
    WHERE owner_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 50
  `;
}

export async function createProjectForUserId(userId, name) {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO projects (owner_id, name)
    VALUES (${userId}, ${name})
    RETURNING id, name, created_at
  `;

  return rows[0];
}
