// api-health-subscriber.ts
import { validateDocCache } from "../hooks/useAppInitializer";
import { validateEnvCache } from "../hooks/useEnvInitializer";
import { docStorage } from "../storage/doc-storage";
import { envInstanceStorage } from "../storage/env-instance-storage";
import { useApiHealthStore } from "../stores/api-state-store";

let lastRefreshRequired = useApiHealthStore.getState().refreshRequired;

useApiHealthStore.subscribe(async (state) => {
  const current = state.refreshRequired;

  // Only on false -> true edge
  if (!current || lastRefreshRequired === true) {
    lastRefreshRequired = current;
    return;
  }
  lastRefreshRequired = current;
  refreshAllStale();
});

export const refreshAllStale = async () => {
  const controller = new AbortController();

  const [doc, env] = await Promise.all([
    docStorage.getDoc(),
    envInstanceStorage.get(),
  ]);

  try {
    if (doc) {
      await validateDocCache(doc, controller.signal);
    }
    if (env) {
      await validateEnvCache(env, controller.signal);
    }
  } finally {
    useApiHealthStore.getState().setRefreshRequired(false);
  }
}
