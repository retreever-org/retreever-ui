import type { HttpMethod } from "./response.types";

export interface Collection {
  name: string;
  deprecated: boolean;
  endpoints: EndpointSummary[];
}

export interface EndpointSummary {
  name: string;
  deprecated: boolean;
  secured: boolean;
  method: HttpMethod;
  path: string;
}
