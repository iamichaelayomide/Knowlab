import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(process.cwd(), "src", "app");
const TARGET_DIRS = ["pages", "components", "services"];
const BAD_MARKERS = ["�", "Â·", "â€¦", "â€”", "â€“"];

function collectFiles(pathname: string, fileList: string[] = []) {
  for (const entry of readdirSync(pathname)) {
    const fullPath = join(pathname, entry);
    if (statSync(fullPath).isDirectory()) {
      collectFiles(fullPath, fileList);
      continue;
    }

    if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

describe("encoding guard", () => {
  it("contains no mojibake markers in core app source", () => {
    const failures: string[] = [];

    for (const dir of TARGET_DIRS) {
      const folder = join(ROOT, dir);
      const files = collectFiles(folder);
      for (const file of files) {
        const content = readFileSync(file, "utf8");
        for (const marker of BAD_MARKERS) {
          if (content.includes(marker)) {
            failures.push(`${file} contains '${marker}'`);
          }
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
