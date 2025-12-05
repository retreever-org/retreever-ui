/* ------------------------ ping response ----------------------- */

export interface PingResponse {
  status: "OK" | string;
  uptime: string;
}

/* ------------------------- Types ------------------------- */

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH";

export type PrimitiveFieldType =
  | "string"
  | "number"
  | "boolean"
  | "uuid"
  | "date-time"
  | "date"
  | "time"
  | "duration"
  | "period"
  | "uri"
  | "enum"
  | "binary"
  | "array"
  | "map"
  | "object";

/* ------------------------- Root document structure ------------------------- */

export interface RetreeverDoc {
  name: string;
  description: string;
  version: string;
  uri_prefix: string | null;
  up_time: string;
  groups: ApiGroup[];
}

/* ------------------------- API Groups & Endpoints ------------------------- */

export interface ApiGroup {
  name: string;
  description: string;
  deprecated: boolean;
  endpoints: Endpoint[];
}

export interface Endpoint {
  name: string;
  description: string | null;
  deprecated: boolean;
  secured: boolean;
  method: HttpMethod;
  path: string;
  status: string;
  status_code: number;

  consumes: string[];
  produces: string[];

  path_variables: EndpointPathVariable[];
  query_params: EndpointQueryParam[];
  headers: EndpointHeader[];

  request: EndpointPayload | null;
  response: EndpointResponse | null;

  errors: EndpointError[];
}

/* ------------------------- Parameters & Headers ------------------------- */

export interface EndpointPathVariable {
  name: string;
  type: PrimitiveFieldType | string;
  required: boolean;
  constraints: string[];
  description: string | null;
}

export interface EndpointQueryParam {
  name: string;
  description: string | null;
  type: PrimitiveFieldType | string;
  required: boolean;
  default_value: string | number | null;
  constraints: string[];
}

export interface EndpointHeader {
  name: string;
  type: PrimitiveFieldType | string;
  required: boolean;
  description: string | null;
}

/* ------------------------- Request/Response Schemas ------------------------- */

export interface EndpointPayload {
  model: string;              // JSON string for display-only
  example_model: string;      // JSON string for display-only
  metadata: Record<string, FieldMetadata>;
}

export interface EndpointResponse {
  model: string;              // JSON string for display-only
  example_model: string;      // JSON string for display-only
}

export interface FieldMetadata {
  description: string;
  required: boolean;
  constraints: string[];
}

/* ------------------------- Error Models ------------------------- */

export interface EndpointError {
  status: string;
  status_code: number;
  description: string;
  error_code: string | null;
  response: EndpointResponse | null;  // Uses simplified string-based response
}
