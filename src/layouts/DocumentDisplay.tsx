import React, { useState } from "react";
import { useViewingEndpoint } from "../stores/viewing-doc-store";
import { CodeBlock } from "../components/documentation/CodeBlock";
import { CheckIcon, ErrorIcon, InfoIcon, SparkIcon } from "../svgs/svgs";
import type { FieldMetadata } from "../types/response.types";
import Metadata from "../components/documentation/Metadata";
import RequestParamView from "../components/documentation/RequestParamView";
import FormType from "../components/documentation/FormType";

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

        <h2 className="flex flex-wrap py-1 px-2 text-lg font-bold tracking-wide font-mono text-surface-100 bg-black/10 rounded-md border border-surface-500/50">
          <span className="pr-2">{endpoint.method}</span>{" "}
          <span className="py-1 pl-2 border-l border-surface-500 text-[0.9rem] tracking-normal font-normal text-success/60 break-all">
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

      <div className="space-y-2">
        {(endpoint.path_variables?.length > 0 ||
          endpoint.query_params?.length > 0 ||
          endpoint.headers?.length > 0 ||
          request) && (
          <h3 className="flex items-center gap-1.5 px-2 text-md font-medium text-surface-200">
            <span className="text-primary-400">
              <InfoIcon />
            </span>{" "}
            <span>Request</span>
          </h3>
        )}

        {(endpoint.path_variables?.length > 0 ||
          endpoint.query_params?.length > 0 ||
          endpoint.headers?.length > 0) && (
          <div className="my-4">
            <RequestParamView
              headers={endpoint?.headers}
              pathVariables={endpoint?.path_variables}
              queryParams={endpoint?.query_params}
            />
          </div>
        )}

        {request && (
          <>
            <div className="text-surface-200 text-sm font-normal font-mono px-3 py-2 mt-4 bg-black/10 border border-surface-500/50 rounded-xl">
              <div>
                ContentType:{" "}
                <span className="text-success/80">{endpoint.consumes}</span>
              </div>
            </div>
            <SwitchableViewWithTitle
              model={request?.model}
              example={request?.example_model}
              metadata={request?.metadata}
              contentTypes={endpoint.consumes}
            />
          </>
        )}
      </div>

      {/* RESPONSE SECTION */}

      <div className="space-y-2">
        <h3 className="flex items-center gap-1.5 px-2 text-md font-medium text-surface-200">
          <span className="text-success/80">
            <CheckIcon />
          </span>{" "}
          <span>Response</span>
        </h3>

        <div className="text-surface-200 text-sm font-normal font-mono px-3 py-2 mt-4 bg-black/10 border border-surface-500/50 rounded-xl">
          <div>
            Status:{" "}
            <span className="text-success/80">
              {endpoint.status_code} - {endpoint.status}
            </span>
          </div>
          <div>
            ContentType:{" "}
            <span className="text-success/80">{endpoint.produces}</span>
          </div>
        </div>

        {response && (
          <SwitchableViewWithTitle
            model={response?.model}
            example={response?.example_model}
            contentTypes={endpoint.produces}
          />
        )}
      </div>

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
              <SwitchableView
                model={err.response?.model}
                example={err.response?.example_model}
                contentTypes={endpoint.produces}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default DocumentDisplay;

// --------------------- Switchable View of Models with header title ----------------------

interface ModelDisplayProps {
  title?: string;
  icon?: React.ReactNode;
  model: string | undefined;
  example: string | undefined;
  metadata?: Record<string, FieldMetadata> | undefined;
  contentTypes?: string[];
}

function SwitchableViewWithTitle({
  title,
  icon,
  model,
  example,
  metadata,
  contentTypes,
}: ModelDisplayProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="flex items-center gap-1.5 px-2 text-md font-medium text-surface-200">
          {icon}
          <span>{title}</span>
        </h3>
      </div>
      <SwitchableView
        model={model}
        example={example}
        metadata={metadata}
        contentTypes={contentTypes}
      />
    </section>
  );
}

// --------------------------- Switchable View of Models ---------------------------

interface SwitchableViewProp {
  model: string | undefined;
  example: string | undefined;
  metadata?: Record<string, FieldMetadata> | undefined;
  contentTypes?: string[];
}

function SwitchableView({
  model,
  example,
  metadata,
  contentTypes,
}: SwitchableViewProp) {
  const [viewMetadata, setViewMetadata] = useState<boolean>();

  if (viewMetadata && metadata) {
    return <Metadata data={metadata} closeMetadata={setViewMetadata} />;
  }
  if (
    contentTypes &&
    contentTypes.some((c) => c.toLocaleLowerCase() === "application/json")
  ) {
    return (
      <CodeBlock
        code={model}
        example={example}
        swapCodeBlock={setViewMetadata}
        swappable={metadata !== undefined}
      />
    );
  }
  if (
    contentTypes &&
    contentTypes.some(
      (c) => c.toLocaleLowerCase() === "application/x-www-form-urlencoded"
    )
  ) {
    return (
      <FormType
        code={model}
        example={example}
        swapCodeBlock={setViewMetadata}
        swappable={metadata !== undefined}
      />
    );
  }
}
