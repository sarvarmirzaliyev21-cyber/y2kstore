// lib/onlineTracker.ts

const globalForOnline = globalThis as unknown as {
  activeUsers: Map<string, number> | undefined;
};

export const activeUsers =
  globalForOnline.activeUsers ?? new Map<string, number>();

if (process.env.NODE_ENV !== "production") {
  globalForOnline.activeUsers = activeUsers;
}