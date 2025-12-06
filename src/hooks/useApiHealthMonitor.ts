import { useEffect } from "react";
import { useApiHealthStore } from "../stores/api-state-store";
import { ping } from "../api/services/ping";

export const useApiHealthMonitor = () => {
  const { setOnline, setOffline } = useApiHealthStore();

  useEffect(() => {
    let interval: number;

    const monitor = async () => {
      try {
        await ping();
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
