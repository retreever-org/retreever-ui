export interface ShortcutItem {
  keys: string;
  description: string;
}

export const SHORTCUTS: ShortcutItem[] = [
  {
    keys: "Alt + Shift + D",
    description: "Toggle the floating docs panel for the active API.",
  },
  {
    keys: "Alt + Shift + E",
    description: "Toggle environment panel",
  },
  {
    keys: "Ctrl + Q",
    description: "Quick search across endpoints and models.",
  },
  {
    keys: "Ctrl + S",
    description: "Save the current API request configuration.",
  },
  {
    keys: "Ctrl + Enter",
    description: "Execute the active API request.",
  },
  {
    keys: "Ctrl + /",
    description: "Toggle shortcuts panel"
  },
];
