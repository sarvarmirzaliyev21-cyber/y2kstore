"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CORRECT_PIN = "1488";

export default function AdminGadPage() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const handlePinChange = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value);
      setError(false);

      if (value.length === 4) {
        if (value === CORRECT_PIN) {
          setIsAuthenticated(true);
        } else {
          setError(true);
          setTimeout(() => setPin(""), 500);
        }
      }
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const res = await fetch("/api/admin/online");
      if (res.ok) {
        const data = await res.json();
        setOnlineCount(data.online);
        setLastUpdated(data.updatedAt);
      }
    } catch (err) {
      console.error("Ошибка при получении онлайна:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOnlineUsers();
      const interval = setInterval(fetchOnlineUsers, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-mono flex items-center justify-center p-6 selection:bg-pink-500 selection:text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {!isAuthenticated ? (
          <div className="backdrop-blur-xl bg-zinc-900/40 border border-white/10 p-8 rounded-3xl shadow-[0_0_30px_rgba(236,72,153,0.15)] text-center">
            <div className="text-3xl mb-3 text-pink-400">🔒</div>
            <h1 className="text-xl font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-300 uppercase mb-2">
              АДМИН-ДОСТУП
            </h1>
            <p className="text-xs text-zinc-400 mb-6">Введите 4-значный PIN-код</p>

            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              placeholder="••••"
              autoFocus
              className={`w-48 text-center text-3xl tracking-[0.5em] bg-zinc-950 border ${
                error
                  ? "border-red-500 text-red-400 animate-shake"
                  : "border-white/15 focus:border-pink-500/80 text-pink-300"
              } rounded-2xl px-4 py-3 outline-none transition-all duration-300 mx-auto block`}
            />

            {error && (
              <p className="text-xs text-red-400 mt-3 font-bold tracking-wider animate-pulse">
                НЕВЕРНЫЙ PIN-КОД
              </p>
            )}
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-zinc-900/40 border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.15)] text-center space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs tracking-widest text-zinc-400 uppercase">
                /ADMIN/GAD
              </span>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPin("");
                }}
                className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 bg-red-950/30 px-3 py-1 rounded-lg transition-all"
              >
                Выйти ✕
              </button>
            </div>

            <div className="py-4">
              <span className="inline-flex items-center gap-2 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> LIVE MONITORING
              </span>

              <h2 className="text-xs uppercase text-zinc-400 tracking-widest mb-1">
                Пользователей на сайте:
              </h2>
              <p className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-pink-400 tracking-wider">
                {onlineCount !== null ? onlineCount : "--"}
              </p>
            </div>

            {lastUpdated && (
              <p className="text-[10px] text-zinc-500 tracking-wider">
                Обновлено в {lastUpdated} (автообновление раз в 5 сек)
              </p>
            )}

            <div className="pt-2 border-t border-white/10">
              <Link
                href="/"
                className="inline-block w-full py-3 rounded-xl font-bold text-xs tracking-widest uppercase bg-zinc-900 border border-white/10 hover:border-pink-500/50 text-zinc-300 hover:text-white transition-all"
              >
                ← Вернуться в каталог
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}