import fs from "node:fs";
import path from "node:path";

const target = process.argv[2];
if (target !== "chrome" && target !== "firefox") {
  throw new Error("Usage: node scripts/build.mjs <chrome|firefox>");
}

const root = process.cwd();
const outDir = path.join(root, "dist", target);

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

/**
 * Copy a directory recursively.
 *
 * @param {string} from - Source directory.
 * @param {string} to - Destination directory.
 * @returns {void}
 */
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(src, dst);
    } else {
      fs.copyFileSync(src, dst);
    }
  }
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const manifestTemplate = JSON.parse(
  fs.readFileSync(path.join(root, "manifests", `${target}.json`), "utf8"),
);

// Keep manifest version in sync with package.json.
// IMPORTANT: Chrome requires numeric dotted version segments (no prerelease tags).
manifestTemplate.version = pkg.version;

fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifestTemplate, null, 2));

copyDir(path.join(root, "dist", "ui"), outDir);
copyDir(path.join(root, "dist", "scripts"), path.join(outDir, "scripts"));

console.log(`[ok] built ${target} -> ${outDir}`);
