"use server";

import { auth } from "@/utils/better-auth/auth";
import pool from "@/utils/db";
import tryCatch from "@/utils/tryCatch";
import { headers } from "next/headers";

interface NotificationRow {
  id: number;
  title: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

async function getSessionUserId(): Promise<string> {
  const [session, sessionError] = await tryCatch(async () =>
    auth.api.getSession({ headers: await headers() }),
  );

  if (sessionError || !session?.user) {
    throw new Error("You must be logged in to perform this action");
  }

  return session.user.id;
}

export async function getUnreadNotificationsCountAction(): Promise<number> {
  const userId = await getSessionUserId();

  const result = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM public.notifications WHERE recipient_id = $1 AND read_at IS NULL`,
    [userId],
  );

  return result.rows.length > 0 ? parseInt(result.rows[0].count, 10) : 0;
}

export async function getNotificationsAction(
  offset: number,
  limit: number,
): Promise<NotificationRow[]> {
  const userId = await getSessionUserId();

  const result = await pool.query<NotificationRow>(
    `SELECT id, title, content, read_at, created_at FROM public.notifications
     WHERE recipient_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );

  return result.rows;
}

export async function markNotificationAsReadAction(
  notificationId: number,
): Promise<void> {
  const userId = await getSessionUserId();

  await pool.query(
    `UPDATE public.notifications SET read_at = NOW() WHERE id = $1 AND recipient_id = $2 AND read_at IS NULL`,
    [notificationId, userId],
  );
}

export async function deleteNotificationAction(
  notificationId: number,
): Promise<void> {
  const userId = await getSessionUserId();

  await pool.query(
    `DELETE FROM public.notifications WHERE id = $1 AND recipient_id = $2`,
    [notificationId, userId],
  );
}
