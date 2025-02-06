# Image Processor CLI

An advanced command-line tool for batch image processing. With this tool, you can resize your images, change their format, and apply various image processing effects.

![image-processor](https://github.com/user-attachments/assets/3a4a2345-854b-4882-af1b-ea23d125b315)

## 🚀 Features

- ✨ Batch image processing
- 📐 Flexible resizing options
- 🎨 Multiple output formats (WebP, JPEG, PNG, jfif)
- 🛠️ Advanced image processing options
- ⚡ Parallel processing support

## 📋 Requirements

- Node.js (v18 or higher)
- pnpm (or npm/yarn)

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/username/image-processor.git
cd image-processor
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the project:

```bash
pnpm build
```

## 💻 Usage

### Local Usage

```bash
pnpm start -i ./input-folder -o ./output-folder
```

### Global Usage

To install the tool globally and use the `image-processor` command in any directory:

```bash
# After cloning the repository
cd image-processor
pnpm link --global
# or:
npm link
```

You can then use the `image-processor` command directly in any directory:

```bash
# Basic usage
image-processor -i ./photos -o ./processed

# With resizing
image-processor -i ./photos -o ./processed -w 1920 -h 1080 -q 85

# With all features
image-processor -i ./photos -o ./processed \
  -w 1920 -h 1080 \
  -e webp \
  -q 85 \
  -f contain \
  --normalize \
  --sharpen \
  --gamma 1.2
```

Note: When using PowerShell or Command Prompt on Windows, use `^` instead of `\` for multiline commands:

```cmd
image-processor -i ./photos -o ./processed ^
  -w 1920 -h 1080 ^
  -e webp ^
  -q 85
```

## 🎮 Command Options

| Option                   | Description                          | Default    |
| ------------------------ | ------------------------------------ | ---------- |
| `-i, --input <dir>`      | Input directory                      | (Required) |
| `-o, --output <dir>`     | Output directory                     | (Required) |
| `-w, --width <number>`   | Width                                | -          |
| `-h, --height <number>`  | Height                               | -          |
| `-e, --extension <type>` | Output format (webp, jpg, png, jfif) | webp       |
| `-q, --quality <number>` | Quality (0-100)                      | 80         |
| `-f, --fit <type>`       | Resize type (cover, contain, fill)   | cover      |
| `--skip-existing`        | Skip existing files                  | false      |
| `--no-parallel`          | Disable parallel processing          | false      |
| `--normalize`            | Normalize image                      | false      |
| `--grayscale`            | Convert to grayscale                 | false      |
| `--blur <sigma>`         | Apply blur (0.3-1000)                | -          |
| `--sharpen`              | Apply sharpening                     | false      |
| `--gamma <value>`        | Apply gamma value (1.0-3.0)          | -          |

## 📝 Examples

### Converting to WebP

```bash
pnpm start -i ./photos -o ./webp-photos -e webp -q 85
```

### Creating Thumbnails

```bash
pnpm start -i ./photos -o ./thumbnails -w 150 -h 150 -f cover
```

### Optimizing for Social Media

```bash
pnpm start -i ./photos -o ./social-media -w 1080 -h 1080 -f cover -q 90 --sharpen
```

## 🤝 Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 🙏 Thanks

Libraries used in this project:

- [sharp](https://sharp.pixelplumbing.com/)
- [commander](https://github.com/tj/commander.js)
- [fs-extra](https://github.com/jprichardson/node-fs-extra)
