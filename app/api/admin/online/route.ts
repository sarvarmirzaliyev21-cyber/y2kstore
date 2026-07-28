import { NextResponse } from "next/server";
import { activeUsers } from "@/lib/onlineTracker";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  const TIMEOUT = 40 * 1000; // 40 секунд таймаут

  // Удаляем устаревшие IP
  for (const [ip, lastPing] of activeUsers.entries()) {
    if (now - lastPing > TIMEOUT) {
      activeUsers.delete(ip);
    }
  }

  return NextResponse.json({
    online: activeUsers.size,
    updatedAt: new Date().toLocaleTimeString("ru-RU"),
  });
}