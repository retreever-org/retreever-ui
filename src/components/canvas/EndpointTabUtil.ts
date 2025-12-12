// File: src/utils/EndpointTabUtility.ts
export type TabItem = { tabKey: string; name: string; order: number };

export const extractMethod = (tabKey: string): string => tabKey.split(":")[0] ?? "";

export const getMethodColor = (method: string): string => {
  switch (method) {
    case "GET":
      return "text-emerald-400/90";
    case "POST":
      return "text-amber-300/90";
    case "PUT":
      return "text-primary-300";
    case "DELETE":
      return "text-rose-300";
    case "PATCH":
      return "text-violet-400";
    default:
      return "text-surface-300";
  }
};

export const sortTabs = (list?: TabItem[]) => {
  return [...(list ?? [])].sort((a, b) => a.order - b.order);
};

/**
 * Calculate where to place the context menu so that it appears below the target element
 * and doesn't overflow the container horizontally.
 */
export const calculateMenuPosition = (
  container: HTMLElement,
  target: HTMLElement,
  opts: { menuWidth: number; gap: number }
) => {
  const containerRect = container.getBoundingClientRect();
  const elRect = target.getBoundingClientRect();

  const left = elRect.left - containerRect.left;
  const top = elRect.bottom - containerRect.top - 10;

  const maxLeft = containerRect.width - opts.menuWidth;
  const finalLeft = Math.max(8, Math.min(left, maxLeft)) + 12;

  return { left: finalLeft, top };
};