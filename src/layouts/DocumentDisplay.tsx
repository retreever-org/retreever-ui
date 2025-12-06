import React from "react";
import { useViewingEndpoint } from "../stores/viewing-doc-store";
import { CodeBlock } from "../components/documentation/CodeBlock";
import { CheckIcon, ErrorIcon, InfoIcon, SparkIcon } from "../svgs/svgs";

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
      <div>
        {/* Heading */}

        <h1 className="flex items-center gap-1.5 text-xl pb-2 mb-4 font-semibold text-surface-100 border-b border-surface-500/30">
          <span className="text-amber-500">
            <SparkIcon />
          </span>{" "}
          <span>{endpoint.name}</span>
        </h1>

        {/* Method & URI / Path */}

        <h2 className="py-1 px-2 text-lg font-bold tracking-wide font-mono text-surface-100 break-all bg-black/10 rounded-md border border-surface-500/50">
          <span className="pr-2 border-r border-surface-500">
            {endpoint.method}
          </span>{" "}
          <span className="py-1 text-[0.9rem] tracking-normal font-normal text-success/60 rounded-md ">
            {endpoint.path}
          </span>
        </h2>

        {endpoint.description && (
          <>
            <h3 className="mt-4 font-medium">Description</h3>
            <p className="text-surface-300 text-sm mt-1">
              {endpoint.description}
            </p>
          </>
        )}
      </div>

      {/* REQUEST SECTION */}

      {request && (
        <section className="space-y-4">
          <h3 className="flex items-center gap-1.5  px-2 text-md font-medium text-surface-200">
            <span className="text-primary-400">
              <InfoIcon />
            </span>
            <span>Request Model</span>
          </h3>
          <CodeBlock code={request?.model} example={request?.example_model} />
        </section>
      )}

      {/* RESPONSE SECTION */}

      {response && (
        <section className="space-y-4">
          <h3 className="flex items-center gap-1.5 px-2 text-md font-medium text-surface-200">
            <span className="text-success/80">
              <CheckIcon />
            </span>
            <span>Response Model</span>
          </h3>
          <CodeBlock code={response?.model} example={response?.example_model} />
        </section>
      )}

      {/* ERROR RESPONSES SECTION */}

      {errors && errors.length > 0 && (
        <section className="space-y-6">
          <h3 className="flex items-center gap-1.5 px-2 text-md font-medium text-surface-200">
            <span className="text-danger/80">
              <ErrorIcon />
            </span>{" "}
            <span>Error Responses</span>
          </h3>

          {errors.map((err, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-rose-400/80 text-sm font-medium px-2">
                {err.status_code} - {err.status}
              </p>
              {err.error_code && (
                <p className="text-surface-300 text-xs font-normal px-2">
                  Error Code: {err.error_code}
                </p>
              )}
              {err.description && (
                <p className="text-surface-300 text-xs font-normal px-2">
                  Description: {err.description}
                </p>
              )}

              <div className="mt-3" />
              <CodeBlock
                code={err.response?.model}
                example={err.response?.example_model}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default DocumentDisplay;
