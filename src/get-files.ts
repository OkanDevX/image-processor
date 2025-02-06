import fs from "fs-extra";
import path from "path";

/**
 * Get all files in the given directory
 * @param dir - The directory to get files from
 * @returns An array of file paths
 */
export async function getFiles(dir: string) {
  let files: string[] = [];

  const items = await fs.readdir(dir, { withFileTypes: true });

  for (let item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      // If it's a directory, go inside and add files
      files = files.concat(await getFiles(fullPath));
    } else if (/\.(jpe?g|png|webp|jfif)$/i.test(item.name)) {
      // Only add image files
      files.push(fullPath);
    }
  }

  return files;
}
