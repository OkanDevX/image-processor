import fs from "fs-extra";
import path from "path";
import sharp from "sharp";

import { getFiles } from "./get-files";

type SharpOperation = (image: sharp.Sharp) => sharp.Sharp;

interface ProcessImagesOptions {
  inputDir: string;
  outputDir: string;
  operations: SharpOperation[];
  outputExtension?: string;
  skipExisting?: boolean;
  parallel?: boolean;
}

export class ImageProcessor {
  // Helper methods for creating Sharp operations
  static resize(options: sharp.ResizeOptions): SharpOperation {
    return (image) => image.resize(options);
  }

  static rotate(angle: number, options?: sharp.RotateOptions): SharpOperation {
    return (image) => image.rotate(angle, options);
  }

  static flip(): SharpOperation {
    return (image) => image.flip();
  }

  static flop(): SharpOperation {
    return (image) => image.flop();
  }

  static sharpen(options?: sharp.SharpenOptions): SharpOperation {
    return (image) => image.sharpen(options);
  }

  static blur(sigma?: number): SharpOperation {
    return (image) => image.blur(sigma);
  }

  static gamma(gamma: number): SharpOperation {
    return (image) => image.gamma(gamma);
  }

  static grayscale(): SharpOperation {
    return (image) => image.grayscale();
  }

  static normalize(): SharpOperation {
    return (image) => image.normalize();
  }

  static format(
    format: keyof sharp.FormatEnum,
    options?:
      | sharp.OutputOptions
      | sharp.JpegOptions
      | sharp.PngOptions
      | sharp.WebpOptions
      | sharp.AvifOptions
      | sharp.HeifOptions
      | sharp.JxlOptions
      | sharp.GifOptions
      | sharp.Jp2Options
      | sharp.TiffOptions
  ): SharpOperation {
    return (image) => image.toFormat(format, options);
  }

  static tint(rgb: sharp.Color): SharpOperation {
    return (image) => image.tint(rgb);
  }

  static async processImages({
    inputDir,
    outputDir,
    operations,
    outputExtension = "webp",
    skipExisting = false,
    parallel = true,
  }: ProcessImagesOptions) {
    try {
      const files = await getFiles(inputDir);

      if (!files.length) {
        console.log("⚠️ No images found.");
        return;
      }

      const processFile = async (file: string) => {
        const relativePath = path.relative(inputDir, file);
        const outputPath = path.join(
          outputDir,
          relativePath.replace(/\.[^/.]+$/, `.${outputExtension}`)
        );

        if (skipExisting && (await fs.pathExists(outputPath))) {
          console.log(`⏭️ Skipped (exists): ${file}`);
          return;
        }

        await fs.ensureDir(path.dirname(outputPath));

        // Create pipeline and apply operations
        const pipeline = operations.reduce(
          (image, operation) => operation(image),
          sharp(file)
        );

        await pipeline.toFile(outputPath);
        console.log(`✅ Processed: ${file} → ${outputPath}`);
      };

      if (parallel) {
        await Promise.all(files.map(processFile));
      } else {
        for (const file of files) {
          await processFile(file);
        }
      }

      console.log("✅ All images processed successfully.");
    } catch (err) {
      console.error("❌ Error:", err);
      throw err;
    }
  }
}
