# png-to-vtf

Convert PNG images to VTF (Valve Texture Format) for Source engine games like Garry's Mod, Counter-Strike, Team Fortress 2, and Half-Life 2.

## Features

- 🎮 Convert PNG images to VTF format for Source engine games
- 🖼️ Multiple format support (RGBA8888, RGB888, RGB565, BGRA5551, BGRA4444)
- 📐 Automatic mipmap generation
- 🔄 Resize images during conversion
- 💾 File and buffer-based APIs
- ⚡ Fast conversion using [sharp](https://sharp.pixelplumbing.com/)

## Installation

```bash
npm install png-to-vtf
```

## Quick Start

```javascript
const { convertPNGToVTF, VTF_FORMATS } = require('png-to-vtf');

// Simple conversion
await convertPNGToVTF('input.png', 'output.vtf');

// With options
await convertPNGToVTF('input.png', 'output.vtf', {
    format: VTF_FORMATS.RGBA8888,
    width: 512,   // Resize to 512x512
    height: 512
});
```

## API Reference

### `convertPNGToVTF(inputPath, outputPath, options?)`

Converts a PNG file to VTF format and saves it to disk.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `inputPath` | `string` | Path to the input PNG file |
| `outputPath` | `string` | Path for the output VTF file |
| `options` | `object` | Optional conversion settings |
| `options.format` | `number` | VTF format (default: `VTF_FORMATS.RGBA8888`) |
| `options.width` | `number` | Target width (should be power of 2) |
| `options.height` | `number` | Target height (should be power of 2) |

**Returns:** `Promise<{ width, height, format }>`

**Example:**

```javascript
const { convertPNGToVTF, VTF_FORMATS } = require('png-to-vtf');

const result = await convertPNGToVTF('texture.png', 'texture.vtf', {
    format: VTF_FORMATS.RGB888,
    width: 256,
    height: 256
});

console.log(`Created ${result.width}x${result.height} VTF`);
```

---

### `convertPNGBufferToVTF(pngBuffer, options?)`

Converts a PNG buffer to VTF format and returns the VTF data as a buffer.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pngBuffer` | `Buffer` | PNG image data as a buffer |
| `options` | `object` | Optional conversion settings (same as above) |

**Returns:** `Promise<Buffer>` - VTF file data

**Example:**

```javascript
const fs = require('fs');
const { convertPNGBufferToVTF } = require('png-to-vtf');

const pngData = fs.readFileSync('texture.png');
const vtfData = await convertPNGBufferToVTF(pngData, {
    width: 128,
    height: 128
});

fs.writeFileSync('texture.vtf', vtfData);
```

---

### `convertRGBAToVTF(rgbaData, width, height, format?, generateMips?)`

Converts raw RGBA pixel data to VTF format.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `rgbaData` | `Buffer` | - | Raw RGBA pixel data (4 bytes per pixel) |
| `width` | `number` | - | Image width |
| `height` | `number` | - | Image height |
| `format` | `number` | `RGBA8888` | Target VTF format |
| `generateMips` | `boolean` | `true` | Generate mipmaps |

**Returns:** `Buffer` - VTF file data

**Example:**

```javascript
const { convertRGBAToVTF, VTF_FORMATS } = require('png-to-vtf');

// Create a 2x2 red texture
const rgbaData = Buffer.from([
    255, 0, 0, 255,  // Red pixel
    255, 0, 0, 255,  // Red pixel
    255, 0, 0, 255,  // Red pixel
    255, 0, 0, 255   // Red pixel
]);

const vtfData = convertRGBAToVTF(rgbaData, 2, 2, VTF_FORMATS.RGBA8888, false);
```

---

### `createVTFHeader(width, height, format, mipmaps?)`

Creates a VTF 7.1 header.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | `number` | - | Image width |
| `height` | `number` | - | Image height |
| `format` | `number` | - | VTF format constant |
| `mipmaps` | `boolean` | `false` | Whether mipmaps are included |

**Returns:** `Buffer` - 64-byte VTF header

---

### `VTF_FORMATS`

Available VTF image formats:

| Format | Value | Description |
|--------|-------|-------------|
| `RGBA8888` | `0` | 32-bit RGBA (8 bits per channel) - Best quality with alpha |
| `RGB888` | `2` | 24-bit RGB (no alpha) - Good quality, smaller size |
| `RGB565` | `4` | 16-bit RGB (5-6-5 bits) - Smaller size, reduced quality |
| `BGRA5551` | `21` | 16-bit BGRA with 1-bit alpha - Good for on/off transparency |
| `BGRA4444` | `19` | 16-bit BGRA (4 bits per channel) - Smallest with alpha |
| `DXT1` | `13` | DXT1 compressed (not implemented) |
| `DXT5` | `15` | DXT5 compressed with alpha (not implemented) |

## Image Size Requirements

For best compatibility with Source engine games, texture dimensions should be powers of 2:

- 16, 32, 64, 128, 256, 512, 1024, 2048, etc.

Use the `width` and `height` options to resize images to valid dimensions during conversion.

## VTF Version

This library generates VTF version 7.1 files with 64-byte headers. This format is compatible with:

- Garry's Mod
- Counter-Strike: Source
- Counter-Strike: Global Offensive
- Team Fortress 2
- Half-Life 2 and episodes
- Portal / Portal 2
- Left 4 Dead / Left 4 Dead 2
- And other Source engine games

## Mipmaps

By default, mipmaps are automatically generated. Mipmaps are smaller versions of your texture used when viewing from a distance, improving both performance and visual quality.

## Limitations

- DXT1 and DXT5 compression are not currently supported (requires additional libraries)
- Animated textures (multi-frame VTF) are not supported
- Cubemaps and volume textures are not supported

## License

MIT License - see [LICENSE](LICENSE) for details.

## Resources

- [VTF Specification](https://developer.valvesoftware.com/wiki/VTF_(Valve_Texture_Format))
- [VTFLib](https://github.com/NeilJed/VTFLib) - Alternative C++ library
