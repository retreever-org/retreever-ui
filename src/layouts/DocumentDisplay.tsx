import React from "react";
import { useViewingEndpoint } from "../stores/viewing-doc-store";
import { CodeBlock } from "../components/documentation/CodeBlock";

const DocumentDisplay: React.FC = () => {
  const endpoint = useViewingEndpoint();

  if (!endpoint) {
    return (
      <div className="p-4 text-surface-300 text-sm text-center">
        Select an API endpoint to view documentation.
      </div>
    );
  }

  const { request, response, errors } = endpoint;

  return (
    <div className="w-full h-full overflow-auto scroll-thin scroll-bar-round p-4 space-y-10 bg-transparent">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-xl pb-2 mb-4 font-semibold text-surface-300 border-b border-surface-500/30">
          {endpoint.name}
        </h1>
        <h2 className="text-lg font-semibold text-surface-100 break-all">
          {endpoint.method}{" "}
          <span className="py-0.5 px-1 font-normal rounded-md bg-white/10">
            {endpoint.path}
          </span>
        </h2>

        {endpoint.description && (
          <p className="text-surface-300 text-sm mt-1">
            {endpoint.description}
          </p>
        )}
      </div>

      {/* REQUEST SECTION */}

      <section className="space-y-4">
        <h3 className="text-md font-semibold text-slate-200">Request Schema</h3>
        <CodeBlock code={request?.model} example={request?.example_model} />
      </section>

      {/* RESPONSE SECTION */}

      <section className="space-y-4">
        <h3 className="text-md font-semibold text-slate-200">
          Response Schema
        </h3>
        <CodeBlock code={response?.model} example={response?.example_model} />
      </section>

      {/* ERROR RESPONSES SECTION */}

      {errors && errors.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-md font-semibold text-slate-200">
            Error Responses
          </h3>

          {errors.map((err, idx) => (
            <div key={idx} className="space-y-3">
              <p className="text-slate-300 text-sm font-medium">
                {err.status} — {err.error_code || "Error"}
              </p>
              <CodeBlock code={err.response?.model} example={err.response?.example_model} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default DocumentDisplay;