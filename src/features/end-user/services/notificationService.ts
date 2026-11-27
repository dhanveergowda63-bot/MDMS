import { eq, fetchAll } from "../../../services/query";
import type { UserNotification } from "../types/endUser";

// A customer's notifications, newest first. With unreadOnly, the server
// returns only unread ones.
export const getNotifications = (
  userId: string,
  unreadOnly: boolean,
  signal?: AbortSignal,
) =>
  fetchAll<UserNotification>(
    "/notifications",
    {
      where: { userId: eq(userId), read: unreadOnly ? eq(false) : undefined },
      sort: { field: "createdAt", direction: "desc" },
    },
    signal,
  );
