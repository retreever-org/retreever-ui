import React, { useEffect, useRef, useState } from "react";
import { useViewingDocStore } from "../stores/viewing-doc-store";
import { SecuredIcon, UnSecuredIcon } from "../svgs/svgs";
import Request from "../components/canvas/Request";
import RequestInputController from "./RequestInputController";
import RequestKeyValueEditor from "../components/canvas/RequestKeyValueEditor";
import FormEditor from "../components/canvas/FormEditor";
import CodeEditor from "../components/canvas/CodeEditor";
import ResponsePanel from "./ResponsePanel";

const TestingPanel: React.FC = () => {
  const { endpoint, tabDoc } = useViewingDocStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    const calculateHeight = () => {
      const navbar = document.querySelector("[data-navbar]");
      const tabStrip = document.querySelector("[data-endpoint-tab-strip]");

      const navbarBottom = navbar
        ? navbar.getBoundingClientRect().bottom
        : 0;

      const tabStripHeight = tabStrip
        ? tabStrip.getBoundingClientRect().height
        : 0;

      setHeight(window.innerHeight - navbarBottom - tabStripHeight);
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  if (!endpoint || !tabDoc) {
    return <div className="p-4 text-sm text-red-500">Invalid Endpoint</div>;
  }

  const isSecured = endpoint.secured;

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col gap-4 p-4 bg-transparent text-white overflow-hidden"
      style={{ height }}
    >
      {/* Title row */}
      <div className="flex items-center gap-2 pb-3 px-1">
        {isSecured ? (
          <span className="w-4 h-4 text-emerald-300/60">
            <SecuredIcon />
          </span>
        ) : (
          <span className="w-4 h-4 text-surface-400">
            <UnSecuredIcon />
          </span>
        )}
        <h3 className="text-sm font-medium truncate lowercase">
          / {endpoint.name.replaceAll(" ", "-")}
        </h3>
      </div>

      <Request />
      <RequestInputController />
      <RequestKeyValueEditor />
      <FormEditor />

      {tabDoc.uiRequest.bodyType === "raw" &&
        tabDoc.uiRequest.editing === "body" && <CodeEditor />}

      <ResponsePanel />
    </section>
  );
};

export default TestingPanel;
