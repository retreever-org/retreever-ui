import AppDocument from "../components/canvas/AppDocument";
import { useCanvasState } from "../stores/canvas-controller-store";
import { useTabOrderList } from "../stores/tab-order-store";
import { XMarkIcon } from "../svgs/svgs";
import { EndpointTabStrip } from "./EndpointTabStrip";
import TestingPanel from "./TestingPanel";

const Canvas: React.FC = () => {
  const { displayApiDoc, setDisplayApiDoc } = useCanvasState();
  const tabList = useTabOrderList();

  if (tabList.length <= 0 || displayApiDoc) {
    return (
      <div className="border-b h-full static overflow-hidden bg-transparent text-surface-200 text-sm pr-12">
        {tabList.length > 0 && (
          <button
            className="w-full flex justify-center items-center bg-primary-400/5 py-0.5 text-xs text-primary-400 cursor-pointer backdrop-blur-md"
            onClick={() => setDisplayApiDoc(!displayApiDoc)}
          >
            <span>
              <XMarkIcon />
            </span>
          </button>
        )}
        <AppDocument />
      </div>
    );
  }

  return (
    <div className="border-b h-full static overflow-hidden bg-transparent text-surface-200 text-sm pr-12">
      <EndpointTabStrip />
      <TestingPanel />
    </div>
  );
};

export default Canvas;
