import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

export const githubDark = createTheme({
  theme: "dark",
  settings: {
    background: "#0d1117",
    foreground: "#c9d1d9",
    caret: "#c9d1d9",
    selection: "#163356",
    gutterBackground: "#0d1117",
    gutterForeground: "#6e7681",
    lineHighlight: "#161b22",
  },
  styles: [
    { tag: t.comment, color: "#8b949e" },
    { tag: t.string, color: "#a5d6ff" },
    { tag: t.number, color: "#79c0ff" },
    { tag: t.keyword, color: "#ff7b72" },
    { tag: t.variableName, color: "#c9d1d9" },
    { tag: t.function(t.variableName), color: "#d2a8ff" },
    { tag: t.typeName, color: "#ffa657" },
  ],
});
