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

// /**
//  * Calculate where to place the context menu so that it appears below the target element
//  * and doesn't overflow the container horizontally.
//  */
// export const calculateMenuPosition = (
//   container: HTMLElement,
//   target: HTMLElement,
//   opts: { menuWidth: number; gap: number }
// ) => {
//   const containerRect = container.getBoundingClientRect();
//   const elRect = target.getBoundingClientRect();

//   // Viewport left: start right of target
//   let left = elRect.right + opts.gap;
  
//   // Flip left if overflows container/viewport right edge
//   const spaceRight = containerRect.right - elRect.right;
//   if (spaceRight < opts.menuWidth) {
//     left = elRect.left - opts.menuWidth - opts.gap;
//   }
  
//   // Clamp to container bounds (with padding)
//   left = Math.max(containerRect.left + 8, Math.min(left, containerRect.right - opts.menuWidth - 8));
  
//   const top = elRect.bottom + opts.gap;  // Viewport top, below target

//   return { left, top };
// };
