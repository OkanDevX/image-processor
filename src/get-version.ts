import { readFileSync } from "fs";
import { join } from "path";

export function getVersion(): string {
  try {
    const packagePath = join(__dirname, "..", "package.json");
    const packageData = readFileSync(packagePath, "utf8");
    const { version } = JSON.parse(packageData);
    return version;
  } catch (error) {
    return "0.0.1";
  }
}
