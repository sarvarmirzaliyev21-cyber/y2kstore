"use client";

import { useEffect } from "react";

export default function OnlineTracker() {
  useEffect(() => {
    fetch("/api/ping", { method: "POST" }).catch(() => {});

    const interval = setInterval(() => {
      fetch("/api/ping", { method: "POST" }).catch(() => {});
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
