import { NextResponse } from "next/server";
import { activeUsers } from "@/lib/onlineTracker";

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  // Извлекаем реальный IP (учитывая прокси)
  const ip = forwarded ? forwarded.split(",")[0] : realIp || "127.0.0.1";

  // Обновляем время последнего визита
  activeUsers.set(ip, Date.now());

  return NextResponse.json({ ok: true });
}