import Canvas from "./layouts/Canvas";
import { Navbar } from "./layouts/Navbar";
import Sidebar from "./layouts/Sidebar";
import { useIsInitializing } from "./stores/doc-store";
import { useAppInitializer } from "./hooks/useAppInitializer";
import { useApiHealthMonitor } from "./hooks/useApiHealthMonitor";
import { FloatingDock } from "./layouts/FloatingDock";
import UtilityBar from "./layouts/UtilityBar";
import { RightDisplayPanel } from "./components/utility/RightDisplayPanel";
import { useEnvInitializer } from "./hooks/useEnvInitializer";
import "./services/auto-refresh-service";
import { initLayoutPersistence } from "./services/layout-persistence-service";
import "./services/viewing-doc-sync-service";
import "./services/tab-order-sync-service";
import { useEffect, useState } from "react";
import { useTabOrderInitializer } from "./hooks/useTabOrderInitializer";
import { useViewingDocInitializer } from "./hooks/useViewingDocInitializer";
import Loading from "./components/canvas/Loading";

function App() {
  const isInitializing = useIsInitializing();
  const [ready, setReady] = useState(false);

  useAppInitializer();
  useApiHealthMonitor();
  useEnvInitializer();
  useTabOrderInitializer();
  useViewingDocInitializer();

  useEffect(() => {
    initLayoutPersistence();
  }, []);

  useEffect(() => {
    if (!isInitializing) {
      const t = setTimeout(() => setReady(true), 1000);
      return () => clearTimeout(t);
    }
  }, [isInitializing]);

  if (isInitializing || !ready) {
    return <Loading />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-linear-to-b from-surface-700 to-surface-800 text-gray-300 relative">
      <Navbar />

      <div className="flex h-[calc(100vh-3rem)] w-full relative">
        <Sidebar />

        <main className="flex-1 overflow-hidden bg-black/15">
          <Canvas />
        </main>

        <UtilityBar />
        <RightDisplayPanel />
      </div>

      <FloatingDock />
    </div>
  );
}

export default App;
