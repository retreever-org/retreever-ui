import { useEffect } from "react";
import { useApiHealthStore } from "../stores/api-state-store";
import { ping } from "../api/services/ping";
import { docStorage } from "../storage/doc-storage";
import type { PingResponse } from "../types/response.types";

export const useApiHealthMonitor = () => {
  const { setOnline, setOffline, setRefreshRequired } = useApiHealthStore();

  const triggerRefresh = async (res: PingResponse) => {
    const doc = await docStorage.getDoc();

    if (doc?.up_time !== res.uptime) {
      setRefreshRequired(true);
    }
  };

  useEffect(() => {
    let interval: number;

    const monitor = async () => {
      try {
        const res = await ping();
        triggerRefresh(res);
        setOnline();
      } catch {
        setOffline();
      }
    };

    // Initial check + 30s intervals
    monitor();
    interval = window.setInterval(monitor, 30_000);

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [setOnline, setOffline]);
};
