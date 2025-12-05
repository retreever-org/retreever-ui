import type { Collection } from "../types/filtered.types";
import type { RetreeverDoc } from "../types/response.types";

export function getSidebarCollections(doc: RetreeverDoc): Collection[] {
  return doc.groups
    .filter(group => !group.deprecated)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(group => ({
      name: group.name,
      deprecated: group.deprecated,
      endpoints: group.endpoints
        .filter(endpoint => !endpoint.deprecated)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(endpoint => ({
          name: endpoint.name,
          deprecated: endpoint.deprecated,
          secured: endpoint.secured,
          method: endpoint.method,
          path: endpoint.path
        }))
    }));
}

