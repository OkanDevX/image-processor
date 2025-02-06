#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { Spinner } from "cli-spinner";

import { ImageProcessor } from "./image-processor";
import { getVersion } from "./get-version";

const program = new Command();

// Create banner
console.log(
  chalk.cyan(`
╔══════════════════════════════════════╗
║         Image Processor CLI          ║
║       Batch Image Processing Tool    ║
╚══════════════════════════════════════╝
`)
);

program
  .name("image-processor")
  .description(chalk.yellow("📸 Advanced batch image processing tool"))
  .version(getVersion())
  .requiredOption("-i, --input <dir>", chalk.cyan("Input directory"))
  .requiredOption("-o, --output <dir>", chalk.cyan("Output directory"))
  .option(
    "-e, --extension <type>",
    chalk.cyan("Output file extension (webp, jpg, png, jfif)"),
    "webp"
  )
  .option("-w, --width <number>", chalk.cyan("Width"), parseInt)
  .option("-h, --height <number>", chalk.cyan("Height"), parseInt)
  .option("-q, --quality <number>", chalk.cyan("Quality (0-100)"), parseInt)
  .option(
    "-f, --fit <type>",
    chalk.cyan("Resize type (cover, contain, fill)"),
    "cover"
  )
  .option("--skip-existing", chalk.cyan("Skip existing files"), false)
  .option("--no-parallel", chalk.cyan("Disable parallel processing"))
  .option("--normalize", chalk.cyan("Normalize image"))
  .option("--grayscale", chalk.cyan("Convert to grayscale"))
  .option("--blur <sigma>", chalk.cyan("Apply blur (0.3-1000)"))
  .option("--sharpen", chalk.cyan("Apply sharpening"))
  .option("--gamma <value>", chalk.cyan("Apply gamma value (1.0-3.0)"));

// Add example usage
program.addHelpText(
  "after",
  `
${chalk.yellow("Example Usage:")}

  ${chalk.green("Basic Usage:")}
  $ image-processor -i ./photos -o ./processed

  ${chalk.green("With Resizing:")}
  $ image-processor -i ./photos -o ./processed -w 1920 -h 1080 -q 85

  ${chalk.green("With All Features:")}
  $ image-processor -i ./photos -o ./processed \\
    -w 1920 -h 1080 -e webp -q 85 -f contain \\
    --normalize --sharpen --gamma 1.2
`
);

program.parse();

const options = program.opts();

// Add menu function
async function showMenu() {
  console.log(chalk.cyan("\n📋 What would you like to do?"));
  console.log(chalk.dim("────────────────────────"));
  console.log("1. Show help");
  console.log("2. Exit");
  console.log(chalk.dim("────────────────────────"));

  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  return new Promise((resolve) => {
    process.stdin.once("data", (data) => {
      const choice = data.toString().trim();
      resolve(choice);
    });
  });
}

// Main process function
async function processImages(options: any) {
  const spinner = new Spinner("Processing... %s");
  spinner.setSpinnerString("|/-\\");

  try {
    // Check parameters
    if (options.quality && (options.quality < 0 || options.quality > 100)) {
      throw new Error("Quality value must be between 0-100");
    }
    if (options.gamma && (options.gamma < 1.0 || options.gamma > 3.0)) {
      throw new Error("Gamma value must be between 1.0-3.0");
    }

    // Check supported formats
    const supportedFormats = ["jpg", "jpeg", "png", "webp", "jfif"];

    if (!supportedFormats.includes(options.extension.toLowerCase())) {
      throw new Error(
        `Unsupported file format: ${
          options.extension
        }. Supported formats: ${supportedFormats.join(", ")}`
      );
    }

    spinner.start();
    console.log(chalk.cyan("\n🔧 Process Configuration:"));
    console.log(chalk.dim("────────────────────────"));
    console.log(chalk.cyan("📁 Input Directory:"), chalk.white(options.input));
    console.log(
      chalk.cyan("📁 Output Directory:"),
      chalk.white(options.output)
    );
    if (options.width || options.height) {
      console.log(
        chalk.cyan("📐 Dimensions:"),
        chalk.white(`${options.width || "auto"}x${options.height || "auto"}`)
      );
    }
    console.log(
      chalk.cyan("🎨 Format:"),
      chalk.white(`${options.extension} (${options.quality}%)`)
    );
    console.log(chalk.dim("────────────────────────\n"));

    const operations: any[] = [];

    // Resize operation
    if (options.width || options.height) {
      operations.push(
        ImageProcessor.resize({
          width: options.width,
          height: options.height,
          fit: options.fit,
        })
      );
    }

    // Add other operations
    if (options.normalize) operations.push(ImageProcessor.normalize());
    if (options.grayscale) operations.push(ImageProcessor.grayscale());
    if (options.blur) operations.push(ImageProcessor.blur(options.blur));
    if (options.sharpen) operations.push(ImageProcessor.sharpen());
    if (options.gamma) operations.push(ImageProcessor.gamma(options.gamma));

    // Add format operation at the end
    operations.push(
      ImageProcessor.format(options.extension, {
        quality: parseInt(options.quality),
      })
    );

    spinner.stop(true);
    console.log(chalk.green("✨ Operations prepared"));
    spinner.start();

    await ImageProcessor.processImages({
      inputDir: options.input,
      outputDir: options.output,
      outputExtension: options.extension,
      operations,
      skipExisting: options.skipExisting,
      parallel: options.parallel,
    });

    spinner.stop(true);
    console.log(chalk.green("✨ All operations completed successfully!"));

    // Show menu and handle choices
    while (true) {
      const choice = await showMenu();

      switch (choice) {
        case "1":
          console.clear();
          program.help();
          return;
        case "2":
          process.exit(0);
        default:
          console.log(chalk.yellow("Invalid choice. Please try again."));
      }
    }
  } catch (error: any) {
    spinner.stop(true);
    console.error(chalk.red("❌ Error:"), error.message);
    await showMenu();
  }
}

// Main execution
(async () => {
  try {
    await processImages(options);
  } catch (error: any) {
    console.error(chalk.red("❌ Error:"), error.message);
    process.exit(1);
  }
})();
