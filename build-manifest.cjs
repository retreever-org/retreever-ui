const fs = require("fs");

const tpl = fs.readFileSync("public/manifest.template.json", "utf8");

const out = tpl
  .replace("__ICON_192__", process.env.VITE_ICON_192 || "")
  .replace("__ICON_256__", process.env.VITE_ICON_256 || "")
  .replace("__ICON_512__", process.env.VITE_ICON_512 || "")
  .replace("__SCREENSHOT__", process.env.VITE_SCREENSHOT || "");

fs.writeFileSync("public/manifest.json", out);
