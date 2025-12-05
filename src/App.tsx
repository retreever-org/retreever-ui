import { useEffect } from "react";
import Canvas from "./layouts/Canvas";
import { Navbar } from "./layouts/Navbar";
import Sidebar from "./layouts/Sidebar";
import SidebarRight from "./layouts/SidebarRight";
import { useIsInitializing } from "./stores/doc-store";
import { AppInitializer } from "./services/app-init";

function App() {
  const isInitializing = useIsInitializing();

  useEffect(() => {
    AppInitializer.initialize();
  }, []);

  if (isInitializing) {
    return (
      <div className="h-screen w-screen bg-surface-800 flex items-center justify-center">
        <div>Loading Retreever...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-linear-to-b from-surface-700 to-surface-800 text-gray-300 relative">

      {/* Top navbar */}
      <Navbar />

      {/* Side navbar */}
      <div className="flex h-[calc(100vh-3rem)] w-full">
        <aside className="w-72 overflow-auto">
          <Sidebar />
        </aside>

        {/* Canvas */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full w-full overflow-auto bg-black/10">
            <Canvas />
          </div>
        </main>

        <aside className="w-12 m-0 overflow-hidden">
          <SidebarRight />
        </aside>
      </div>
    </div>
  );
}

export default App;
