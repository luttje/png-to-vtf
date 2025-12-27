/**
 * PNG to VTF (Valve Texture Format) Converter for Node.js
 *
 * Converts PNG images to VTF format files for use in Source engine games.
 *
 * VTF Specification:
 * https://developer.valvesoftware.com/wiki/VTF_(Valve_Texture_Format)
 *
 * This implementation uses VTF version 7.2 with 80-byte headers.
 * Version 7.2 adds proper depth support and is widely compatible.
 */

const fs = require('fs');
const sharp = require('sharp');
const dxt = require('dxt-js');

// ============================================================================
// VTF Format Constants
// ============================================================================

/**
 * VTF Image Formats
 * These correspond to the IMAGE_FORMAT enum in the VTF specification
 * Values match the Source engine's imageformat.h
 * @const
 * @type {Object.<string, number>}
 */
const VTF_FORMATS = {
  RGBA8888: 0,      // 32-bit RGBA (8 bits per channel)
  ABGR8888: 1,      // 32-bit ABGR (8 bits per channel)
  RGB888: 2,        // 24-bit RGB (8 bits per channel, no alpha)
  BGR888: 3,        // 24-bit BGR (8 bits per channel, no alpha) - preferred for opaque
  RGB565: 4,        // 16-bit RGB (5-6-5 bits per channel)
  I8: 5,            // 8-bit luminance (grayscale)
  IA88: 6,          // 16-bit luminance + alpha (8 bits each)
  P8: 7,            // 8-bit paletted (not supported by engine)
  A8: 8,            // 8-bit alpha only
  RGB888_BLUESCREEN: 9,   // RGB with blue = transparent
  BGR888_BLUESCREEN: 10,  // BGR with blue = transparent
  ARGB8888: 11,     // 32-bit ARGB
  BGRA8888: 12,     // 32-bit BGRA (8 bits per channel) - common format
  DXT1: 13,         // DXT1/BC1 block compression (4 bpp)
  DXT3: 14,         // DXT3/BC2 block compression (8 bpp, sharp alpha)
  DXT5: 15,         // DXT5/BC3 block compression (8 bpp, smooth alpha)
  BGRX8888: 16,     // 32-bit BGR with unused alpha (always 255)
  BGR565: 17,       // 16-bit BGR (5-6-5 bits) - preferred over RGB565
  BGRX5551: 18,     // 16-bit BGR with unused alpha bit
  BGRA4444: 19,     // 16-bit BGRA (4 bits per channel)
  DXT1_ONEBITALPHA: 20, // DXT1 with 1-bit alpha
  BGRA5551: 21,     // 16-bit BGRA (5-5-5-1 bits per channel)
  UV88: 22,         // 16-bit du/dv format for bump maps
  UVWQ8888: 23,     // 32-bit du/dv format
  RGBA16161616F: 24, // 64-bit floating point RGBA (HDR)
  RGBA16161616: 25, // 64-bit integer RGBA (HDR)
  UVLX8888: 26      // 32-bit du/dv/luminance format
};

/**
 * VTF Texture Flags
 * These control how the texture is processed and displayed
 * @const
 * @type {Object.<string, number>}
 */
const VTF_FLAGS = {
  POINTSAMPLE: 0x0001,        // Point sampling (no filtering)
  TRILINEAR: 0x0002,          // Trilinear filtering
  CLAMPS: 0x0004,             // Clamp S coordinate
  CLAMPT: 0x0008,             // Clamp T coordinate
  ANISOTROPIC: 0x0010,        // Anisotropic filtering
  HINT_DXT5: 0x0020,          // Hint to use DXT5 compression
  PWL_CORRECTED: 0x0040,      // Purpose unknown (v7.4+)
  NORMAL: 0x0080,             // Normal map
  NOMIP: 0x0100,              // No mipmaps
  NOLOD: 0x0200,              // No level of detail
  ALL_MIPS: 0x0400,           // Load all mipmap levels (no LOD)
  PROCEDURAL: 0x0800,         // Procedural texture
  ONEBITALPHA: 0x1000,        // 1-bit alpha (on/off transparency)
  EIGHTBITALPHA: 0x2000,      // 8-bit alpha channel
  ENVMAP: 0x4000,             // Environment map
  RENDERTARGET: 0x8000,       // Render target
  DEPTHRENDERTARGET: 0x10000, // Depth render target
  NODEBUGOVERRIDE: 0x20000,   // No debug override
  SINGLECOPY: 0x40000,        // Single copy
  PRE_SRGB: 0x80000,          // Pre-SRGB (v7.4+, deprecated in v7.5)
  UNUSED_00100000: 0x100000,  // Unused
  UNUSED_00200000: 0x200000,  // Unused
  UNUSED_00400000: 0x400000,  // Unused
  NODEPTHBUFFER: 0x800000,    // No depth buffer
  UNUSED_01000000: 0x1000000, // Unused
  CLAMPU: 0x2000000,          // Clamp U coordinate
  VERTEXTEXTURE: 0x4000000,   // Vertex texture
  SSBUMP: 0x8000000,          // Self-shadowed bump map
  UNUSED_10000000: 0x10000000, // Unused
  BORDER: 0x20000000,         // Border clamp (v7.4+)
  UNUSED_40000000: 0x40000000, // Unused
  UNUSED_80000000: 0x80000000  // Unused
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Write a 16-bit unsigned short value to a buffer (little-endian)
 * @param {Buffer} buffer - The buffer to write to
 * @param {number} offset - The byte offset in the buffer
 * @param {number} value - The 16-bit unsigned integer value to write
 * @returns {void}
 */
function writeUint16(buffer, offset, value) {
  buffer[offset] = value & 0xFF;
  buffer[offset + 1] = (value >>> 8) & 0xFF;
}

/**
 * Write a 32-bit unsigned integer to a buffer (little-endian)
 * @param {Buffer} buffer - The buffer to write to
 * @param {number} offset - The byte offset in the buffer
 * @param {number} value - The 32-bit unsigned integer value to write
 * @returns {void}
 */
function writeUint32(buffer, offset, value) {
  buffer[offset] = value & 0xFF;
  buffer[offset + 1] = (value >>> 8) & 0xFF;
  buffer[offset + 2] = (value >>> 16) & 0xFF;
  buffer[offset + 3] = (value >>> 24) & 0xFF;
}

/**
 * Write a 32-bit float to a buffer (little-endian)
 * @param {Buffer} buffer - The buffer to write to
 * @param {number} offset - The byte offset in the buffer
 * @param {number} value - The 32-bit floating point value to write
 * @returns {void}
 */
function writeFloat32(buffer, offset, value) {
  const floatBuffer = Buffer.alloc(4);
  floatBuffer.writeFloatLE(value, 0);
  floatBuffer.copy(buffer, offset);
}

/**
 * Check if a number is a power of 2
 * @param {number} n - The number to check
 * @returns {boolean} True if n is a power of 2
 */
function isPowerOf2(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

/**
 * Get the next power of 2 greater than or equal to n
 * @param {number} n - The input number
 * @returns {number} The next power of 2 greater than or equal to n
 */
function nextPowerOf2(n) {
  if (n <= 1) return 1;
  n--;
  n |= n >> 1;
  n |= n >> 2;
  n |= n >> 4;
  n |= n >> 8;
  n |= n >> 16;
  return n + 1;
}

/**
 * Get bytes per pixel for a given format
 * @param {number} format - VTF format constant from VTF_FORMATS
 * @returns {number} Bytes per pixel (may be fractional for DXT formats)
 */
function getBytesPerPixel(format) {
  switch (format) {
    case VTF_FORMATS.RGBA8888:
    case VTF_FORMATS.ABGR8888:
    case VTF_FORMATS.ARGB8888:
    case VTF_FORMATS.BGRA8888:
    case VTF_FORMATS.BGRX8888:
    case VTF_FORMATS.UVWQ8888:
    case VTF_FORMATS.UVLX8888:
      return 4;
    case VTF_FORMATS.RGB888:
    case VTF_FORMATS.BGR888:
    case VTF_FORMATS.RGB888_BLUESCREEN:
    case VTF_FORMATS.BGR888_BLUESCREEN:
      return 3;
    case VTF_FORMATS.RGB565:
    case VTF_FORMATS.BGR565:
    case VTF_FORMATS.BGRA4444:
    case VTF_FORMATS.BGRA5551:
    case VTF_FORMATS.BGRX5551:
    case VTF_FORMATS.IA88:
    case VTF_FORMATS.UV88:
      return 2;
    case VTF_FORMATS.I8:
    case VTF_FORMATS.A8:
    case VTF_FORMATS.P8:
      return 1;
    case VTF_FORMATS.RGBA16161616F:
    case VTF_FORMATS.RGBA16161616:
      return 8;
    // DXT formats use block compression (calculated differently)
    case VTF_FORMATS.DXT1:
    case VTF_FORMATS.DXT1_ONEBITALPHA:
      return 0.5; // 4 bits per pixel
    case VTF_FORMATS.DXT3:
    case VTF_FORMATS.DXT5:
      return 1; // 8 bits per pixel
    default:
      return 4;
  }
}

// ============================================================================
// Image Format Conversion Functions
// ============================================================================

/**
 * Convert RGBA8888 to BGRA8888
 * Swaps R and B channels for Source engine compatibility
 * @param {Buffer} data - RGBA8888 pixel data
 * @returns {Buffer} BGRA8888 pixel data
 */
function convertRGBA8888ToBGRA8888(data) {
  const output = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 4) {
    output[i] = data[i + 2];     // B <- R
    output[i + 1] = data[i + 1]; // G
    output[i + 2] = data[i];     // R <- B
    output[i + 3] = data[i + 3]; // A
  }

  return output;
}

/**
 * Convert RGBA8888 to ABGR8888
 * @param {Buffer} data - RGBA8888 pixel data
 * @returns {Buffer} ABGR8888 pixel data
 */
function convertRGBA8888ToABGR8888(data) {
  const output = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 4) {
    output[i] = data[i + 3];     // A
    output[i + 1] = data[i + 2]; // B
    output[i + 2] = data[i + 1]; // G
    output[i + 3] = data[i];     // R
  }

  return output;
}

/**
 * Convert RGBA8888 to ARGB8888
 * @param {Buffer} data - RGBA8888 pixel data
 * @returns {Buffer} ARGB8888 pixel data
 */
function convertRGBA8888ToARGB8888(data) {
  const output = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 4) {
    output[i] = data[i + 3];     // A
    output[i + 1] = data[i];     // R
    output[i + 2] = data[i + 1]; // G
    output[i + 3] = data[i + 2]; // B
  }

  return output;
}

/**
 * Convert RGBA8888 to RGB888
 * Strips the alpha channel from 32-bit RGBA data
 * @param {Buffer} data - RGBA8888 pixel data
 * @returns {Buffer} RGB888 pixel data
 */
function convertRGBA8888ToRGB888(data) {
  const output = Buffer.alloc((data.length / 4) * 3);

  for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
    output[j] = data[i];         // R
    output[j + 1] = data[i + 1]; // G
    output[j + 2] = data[i + 2]; // B
  }

  return output;
}

/**
 * Convert RGBA8888 to BGR888
 * Strips alpha and swaps R/B for Source engine (preferred opaque format)
 * @param {Buffer} data - RGBA8888 pixel data
 * @returns {Buffer} BGR888 pixel data
 */
function convertRGBA8888ToBGR888(data) {
  const output = Buffer.alloc((data.length / 4) * 3);

  for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
    output[j] = data[i + 2];     // B
    output[j + 1] = data[i + 1]; // G
    output[j + 2] = data[i];     // R
  }

  return output;
}

/**
 * Convert RGBA8888 to I8 (grayscale/luminance)
 * Uses standard luminance formula: Y = 0.299R + 0.587G + 0.114B
 * @param {Buffer} data - RGBA8888 pixel data
 * @returns {Buffer} I8 (grayscale) pixel data
 */
function convertRGBA8888ToI8(data) {
  const output = Buffer.alloc(data.length / 4);

  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    const luminance = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    );
    output[j] = luminance;
  }

  return output;
}

/**
 * Convert RGBA8888 to IA88 (grayscale + alpha)
 * @param {Buffer} data - RGBA8888 pixel data
 * @returns {Buffer} IA88 (grayscale + alpha) pixel data
 */
function convertRGBA8888ToIA88(data) {
  const output = Buffer.alloc((data.length / 4) * 2);

  for (let i = 0, j = 0; i < data.length; i += 4, j += 2) {
    const luminance = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    );
    output[j] = luminance;       // I (intensity/luminance)
    output[j + 1] = data[i + 3]; // A (alpha)
  }

  return output;
}

/**
 * Convert RGBA8888 to A8 (alpha only)
 * @param {Buffer} data - RGBA8888 pixel data
 * @returns {Buffer} A8 (alpha only) pixel data
 */
function convertRGBA8888ToA8(data) {
  const output = Buffer.alloc(data.length / 4);

  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    output[j] = data[i + 3]; // A
  }

  return output;
}

/**
 * Convert RGBA8888 to RGB565
 * Reduces color depth to 16-bit: 5 bits red, 6 bits green, 5 bits blue
 * @param {Buffer} data - RGBA8888 pixel data
 * @returns {Buffer} RGB565 pixel data
 */
function convertRGBA8888ToRGB565(data) {
  const output = Buffer.alloc((data.length / 4) * 2);

  for (let i = 0, j = 0; i < data.length; i += 4, j += 2) {
    const r = data[i] >> 3;       // 5 bits
    const g = data[i + 1] >> 2;   // 6 bits
    const b = data[i + 2] >> 3;   // 5 bits

    const rgb565 = (r) | (g << 5) | (b << 11);
    writeUint16(output, j, rgb565);
  }

  return output;
}

/**
 * Convert RGBA8888 to BGR565
 * Reduces color depth to 16-bit with BGR order (preferred over RGB565)
 * @param {Buffer} data - RGBA8888 pixel data
 * @returns {Buffer} BGR565 pixel data
 */
function convertRGBA8888ToBGR565(data) {
  const output = Buffer.alloc((data.length / 4) * 2);

  for (let i = 0, j = 0; i < data.length; i += 4, j += 2) {
    const r = data[i] >> 3;       // 5 bits
    const g = data[i + 1] >> 2;   // 6 bits
    const b = data[i + 2] >> 3;   // 5 bits

    // BGR565: BBBBBGGG GGGRRRRR
    const bgr565 = (b) | (g << 5) | (r << 11);
    writeUint16(output, j, bgr565);
  }

  return output;
}

/**
 * Convert RGBA8888 to BGRA5551
 * Reduces to 16-bit: 5 bits each for RGB, 1 bit for alpha (on/off transparency)
 * @param {Buffer} data - RGBA8888 pixel data
 * @returns {Buffer} BGRA5551 pixel data
 */
function convertRGBA8888ToBGRA5551(data) {
  const output = Buffer.alloc((data.length / 4) * 2);

  for (let i = 0, j = 0; i < data.length; i += 4, j += 2) {
    const r = data[i] >> 3;       // 5 bits
    const g = data[i + 1] >> 3;   // 5 bits
    const b = data[i + 2] >> 3;   // 5 bits
    const a = data[i + 3] >> 7;   // 1 bit

    const bgra5551 = (b) | (g << 5) | (r << 10) | (a << 15);
    writeUint16(output, j, bgra5551);
  }

  return output;
}

/**
 * Convert RGBA8888 to BGRA4444
 * Reduces to 16-bit: 4 bits per channel for BGRA
 * @param {Buffer} data - RGBA8888 pixel data
 * @returns {Buffer} BGRA4444 pixel data
 */
function convertRGBA8888ToBGRA4444(data) {
  const output = Buffer.alloc((data.length / 4) * 2);

  for (let i = 0, j = 0; i < data.length; i += 4, j += 2) {
    const r = data[i] >> 4;       // 4 bits
    const g = data[i + 1] >> 4;   // 4 bits
    const b = data[i + 2] >> 4;   // 4 bits
    const a = data[i + 3] >> 4;   // 4 bits

    const bgra4444 = (b) | (g << 4) | (r << 8) | (a << 12);
    writeUint16(output, j, bgra4444);
  }

  return output;
}

/**
 * Convert RGBA8888 to UV88 (for normal/bump maps)
 * Uses R as U and G as V, discards B and A
 * @param {Buffer} data - RGBA8888 pixel data
 * @returns {Buffer} UV88 pixel data
 */
function convertRGBA8888ToUV88(data) {
  const output = Buffer.alloc((data.length / 4) * 2);

  for (let i = 0, j = 0; i < data.length; i += 4, j += 2) {
    output[j] = data[i];         // U <- R
    output[j + 1] = data[i + 1]; // V <- G
  }

  return output;
}

// ============================================================================
// DXT Compression Functions
// ============================================================================

/**
 * Calculate DXT compressed data size
 * DXT uses 4x4 pixel blocks
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} format - VTF DXT format (DXT1, DXT3, or DXT5 from VTF_FORMATS)
 * @returns {number} Size in bytes
 */
function calculateDXTSize(width, height, format) {
  // Round up to nearest multiple of 4
  const blocksX = Math.max(1, Math.ceil(width / 4));
  const blocksY = Math.max(1, Math.ceil(height / 4));
  const numBlocks = blocksX * blocksY;

  // DXT1: 8 bytes per block, DXT3/DXT5: 16 bytes per block
  if (format === VTF_FORMATS.DXT1 || format === VTF_FORMATS.DXT1_ONEBITALPHA) {
    return numBlocks * 8;
  } else {
    return numBlocks * 16;
  }
}

/**
 * Compress RGBA data to DXT format
 * @param {Buffer} rgbaData - RGBA pixel data (4 bytes per pixel)
 * @param {number} width - Image width (should be multiple of 4)
 * @param {number} height - Image height (should be multiple of 4)
 * @param {number} format - VTF DXT format (DXT1, DXT3, or DXT5 from VTF_FORMATS)
 * @returns {Buffer} DXT compressed data
 * @throws {Error} If format is not a supported DXT format
 */
function compressToDXT(rgbaData, width, height, format) {
  // Determine dxt-js flags based on format
  let dxtFlags;
  switch (format) {
    case VTF_FORMATS.DXT1:
    case VTF_FORMATS.DXT1_ONEBITALPHA:
      dxtFlags = dxt.flags.DXT1;
      break;
    case VTF_FORMATS.DXT3:
      dxtFlags = dxt.flags.DXT3;
      break;
    case VTF_FORMATS.DXT5:
      dxtFlags = dxt.flags.DXT5;
      break;
    default:
      throw new Error(`Unsupported DXT format: ${format}`);
  }

  // dxt-js expects a Uint8Array
  const inputArray = new Uint8Array(rgbaData);

  // Compress using dxt-js
  const compressed = dxt.compress(inputArray, width, height, dxtFlags);

  return Buffer.from(compressed);
}

// ============================================================================
// VTF Header Creation
// ============================================================================

/**
 * Create VTF header according to VTF 7.2 specification
 * VTF 7.2 uses 80-byte headers and adds depth support
 *
 * Header structure (80 bytes for v7.2):
 * Offset  Size  Description
 * 0       4     Signature "VTF\0"
 * 4       4     Version major (uint32)
 * 8       4     Version minor (uint32)
 * 12      4     Header size (uint32)
 * 16      2     Width (uint16)
 * 18      2     Height (uint16)
 * 20      4     Flags (uint32)
 * 24      2     Frames (uint16)
 * 26      2     First frame (uint16)
 * 28      4     Padding
 * 32      12    Reflectivity (3 floats)
 * 44      4     Padding
 * 48      4     Bumpmap scale (float)
 * 52      4     High-res format (uint32)
 * 56      1     Mipmap count (uint8)
 * 57      4     Low-res format (uint32)
 * 61      1     Low-res width (uint8)
 * 62      1     Low-res height (uint8)
 * 63      2     Depth (uint16) - v7.2+
 * 65      3     Padding (v7.2+)
 * 68      4     Num resources (v7.3+, we set to 0)
 * 72      8     Padding
 *
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} format - VTF format constant from VTF_FORMATS
 * @param {Object} [options] - Header options
 * @param {boolean} [options.mipmaps=false] - Whether mipmaps are included
 * @param {number|null} [options.flags=null] - VTF flags (auto-detected if null)
 * @param {number} [options.frames=1] - Number of animation frames
 * @param {number} [options.firstFrame=0] - First frame index
 * @param {[number, number, number]} [options.reflectivity=[0,0,0]] - Reflectivity RGB normalized 0-1
 * @param {number} [options.bumpmapScale=1.0] - Bumpmap scale
 * @param {number} [options.depth=1] - Texture depth (for volumetric textures)
 * @returns {Buffer} VTF header (80 bytes)
 */
function createVTFHeader(width, height, format, options = {}) {
  const {
    mipmaps = false,
    flags = null,
    frames = 1,
    firstFrame = 0,
    reflectivity = [0, 0, 0],
    bumpmapScale = 1.0,
    depth = 1
  } = options;

  // VTF 7.2 header size is 80 bytes
  const header = Buffer.alloc(80);

  // Signature: "VTF\0" (4 bytes)
  header[0] = 0x56;  // 'V'
  header[1] = 0x54;  // 'T'
  header[2] = 0x46;  // 'F'
  header[3] = 0x00;

  // Version: 7.2 (8 bytes total: two unsigned ints)
  writeUint32(header, 4, 7);   // Major version
  writeUint32(header, 8, 2);   // Minor version

  // Header size in bytes (uint32)
  writeUint32(header, 12, 80);

  // Width and height (uint16)
  writeUint16(header, 16, width);
  writeUint16(header, 18, height);

  // Determine flags automatically if not specified
  let textureFlags = flags;
  if (textureFlags === null) {
    textureFlags = 0;
    // Check if format supports alpha
    const hasAlpha = [
      VTF_FORMATS.RGBA8888, VTF_FORMATS.ABGR8888, VTF_FORMATS.ARGB8888,
      VTF_FORMATS.BGRA8888, VTF_FORMATS.BGRA4444, VTF_FORMATS.BGRA5551,
      VTF_FORMATS.IA88, VTF_FORMATS.A8, VTF_FORMATS.DXT3, VTF_FORMATS.DXT5
    ].includes(format);

    if (hasAlpha) {
      // Use 8-bit alpha flag for formats with full alpha
      if ([VTF_FORMATS.BGRA5551, VTF_FORMATS.DXT1_ONEBITALPHA].includes(format)) {
        textureFlags |= VTF_FLAGS.ONEBITALPHA;
      } else {
        textureFlags |= VTF_FLAGS.EIGHTBITALPHA;
      }
    }
  }
  writeUint32(header, 20, textureFlags);

  // Number of frames (uint16)
  writeUint16(header, 24, frames);

  // First frame index (uint16)
  writeUint16(header, 26, firstFrame);

  // Padding (4 bytes)
  writeUint32(header, 28, 0);

  // Reflectivity vector (3 floats = 12 bytes)
  writeFloat32(header, 32, reflectivity[0]);
  writeFloat32(header, 36, reflectivity[1]);
  writeFloat32(header, 40, reflectivity[2]);

  // Padding (4 bytes)
  writeUint32(header, 44, 0);

  // Bumpmap scale (float)
  writeFloat32(header, 48, bumpmapScale);

  // High resolution image format (uint32)
  writeUint32(header, 52, format);

  // Mipmap count (uint8)
  header[56] = mipmaps ? calculateMipmapCount(width, height) : 1;

  // Low resolution image format (uint32) - DXT1 for thumbnails
  // We set this to DXT1 but with 0x0 dimensions to indicate no thumbnail
  writeUint32(header, 57, VTF_FORMATS.DXT1);

  // Low resolution image dimensions (uint8 each)
  // Set to 0 to indicate no low-res thumbnail data
  header[61] = 0;  // Low-res width
  header[62] = 0;  // Low-res height

  // Depth (uint16) - v7.2+, always 1 for 2D textures
  writeUint16(header, 63, depth);

  // Padding for v7.2 (3 bytes at offset 65)
  header[65] = 0;
  header[66] = 0;
  header[67] = 0;

  // Num resources (uint32) - v7.3+ feature, we set to 0
  writeUint32(header, 68, 0);

  // Final padding (8 bytes)
  for (let i = 72; i < 80; i++) {
    header[i] = 0;
  }

  return header;
}

/**
 * Calculate number of mipmap levels needed.
 *
 * In accordance with what the wiki states:
 * "Typically each subsequent MIP level is half the size of the previous, which guarantees that the complete texture (the original and its mipmaps) is no greater than 1.5 times the original texture. "
 * https://developer.valvesoftware.com/wiki/Mipmapping
 *
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {number} Total mipmap levels including the base image
 */
function calculateMipmapCount(width, height) {
  let count = 1;
  let w = width;
  let h = height;

  while (w > 1 || h > 1) {
    w = Math.max(1, Math.floor(w / 2));
    h = Math.max(1, Math.floor(h / 2));
    count++;
  }

  return count;
}

// ============================================================================
// Mipmap Generation
// ============================================================================

/**
 * Generate mipmap chain from RGBA data
 * Returns array of buffers from smallest to largest (VTF order)
 * @param {Buffer} rgbaData - Original RGBA pixel data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Buffer[]} Array of mipmap buffers, smallest first
 */
function generateMipmaps(rgbaData, width, height) {
  const mipmaps = [];
  let currentData = rgbaData;
  let currentW = width;
  let currentH = height;

  // Start with the full-size image
  mipmaps.push(currentData);

  // Generate progressively smaller mipmaps
  while (currentW > 1 || currentH > 1) {
    const newW = Math.max(1, Math.floor(currentW / 2));
    const newH = Math.max(1, Math.floor(currentH / 2));
    const newData = Buffer.alloc(newW * newH * 4);

    // Simple box filter downsampling
    for (let y = 0; y < newH; y++) {
      for (let x = 0; x < newW; x++) {
        const srcX = Math.min(x * 2, currentW - 1);
        const srcY = Math.min(y * 2, currentH - 1);
        const srcX1 = Math.min(srcX + 1, currentW - 1);
        const srcY1 = Math.min(srcY + 1, currentH - 1);

        // Sample 4 pixels and average
        const idx00 = (srcY * currentW + srcX) * 4;
        const idx10 = (srcY * currentW + srcX1) * 4;
        const idx01 = (srcY1 * currentW + srcX) * 4;
        const idx11 = (srcY1 * currentW + srcX1) * 4;

        const dstIdx = (y * newW + x) * 4;

        for (let c = 0; c < 4; c++) {
          const avg = Math.round(
            (currentData[idx00 + c] + currentData[idx10 + c] +
              currentData[idx01 + c] + currentData[idx11 + c]) / 4
          );
          newData[dstIdx + c] = avg;
        }
      }
    }

    mipmaps.push(newData);
    currentData = newData;
    currentW = newW;
    currentH = newH;
  }

  // Reverse so smallest is first (VTF format requirement)
  return mipmaps.reverse();
}

/**
 * Convert mipmap data to specified format
 * @param {Buffer[]} mipmaps - Array of RGBA mipmap buffers (smallest first)
 * @param {number} format - Target VTF format from VTF_FORMATS
 * @returns {Buffer[]} Converted mipmap buffers in the target format
 */
function convertMipmapsToFormat(mipmaps, format) {
  return mipmaps.map(mipmap => convertToFormat(mipmap, format));
}

/**
 * Convert RGBA data to the specified VTF format
 * @param {Buffer} rgbaData - RGBA pixel data (4 bytes per pixel)
 * @param {number} format - Target VTF format from VTF_FORMATS
 * @returns {Buffer} Converted pixel data in the target format
 * @throws {Error} If format is a DXT format (use compressToDXT instead)
 */
function convertToFormat(rgbaData, format) {
  switch (format) {
    case VTF_FORMATS.RGBA8888:
      return rgbaData;
    case VTF_FORMATS.BGRA8888:
      return convertRGBA8888ToBGRA8888(rgbaData);
    case VTF_FORMATS.ABGR8888:
      return convertRGBA8888ToABGR8888(rgbaData);
    case VTF_FORMATS.ARGB8888:
      return convertRGBA8888ToARGB8888(rgbaData);
    case VTF_FORMATS.RGB888:
      return convertRGBA8888ToRGB888(rgbaData);
    case VTF_FORMATS.BGR888:
      return convertRGBA8888ToBGR888(rgbaData);
    case VTF_FORMATS.RGB565:
      return convertRGBA8888ToRGB565(rgbaData);
    case VTF_FORMATS.BGR565:
      return convertRGBA8888ToBGR565(rgbaData);
    case VTF_FORMATS.BGRA5551:
      return convertRGBA8888ToBGRA5551(rgbaData);
    case VTF_FORMATS.BGRA4444:
      return convertRGBA8888ToBGRA4444(rgbaData);
    case VTF_FORMATS.I8:
      return convertRGBA8888ToI8(rgbaData);
    case VTF_FORMATS.IA88:
      return convertRGBA8888ToIA88(rgbaData);
    case VTF_FORMATS.A8:
      return convertRGBA8888ToA8(rgbaData);
    case VTF_FORMATS.UV88:
      return convertRGBA8888ToUV88(rgbaData);
    // DXT formats are handled separately in convertToDXTFormat
    case VTF_FORMATS.DXT1:
    case VTF_FORMATS.DXT1_ONEBITALPHA:
    case VTF_FORMATS.DXT3:
    case VTF_FORMATS.DXT5:
      throw new Error(`DXT format conversion requires width/height. Use convertToDXTFormat() instead.`);
    default:
      console.warn(`Unknown format ${format}, using RGBA8888`);
      return rgbaData;
  }
}

// ============================================================================
// Main Conversion Functions
// ============================================================================

/**
 * Calculate average reflectivity from RGBA data
 * Used by VRAD for radiosity calculations
 * @param {Buffer} rgbaData - RGBA pixel data (4 bytes per pixel)
 * @returns {[number, number, number]} Reflectivity [r, g, b] normalized to 0-1
 */
function calculateReflectivity(rgbaData) {
  let r = 0, g = 0, b = 0;
  const pixelCount = rgbaData.length / 4;

  for (let i = 0; i < rgbaData.length; i += 4) {
    r += rgbaData[i];
    g += rgbaData[i + 1];
    b += rgbaData[i + 2];
  }

  return [
    (r / pixelCount) / 255,
    (g / pixelCount) / 255,
    (b / pixelCount) / 255
  ];
}

/**
 * Convert raw RGBA pixel data to VTF format
 * @param {Buffer} rgbaData - Raw RGBA pixel data (4 bytes per pixel)
 * @param {number} width - Image width (should be power of 2)
 * @param {number} height - Image height (should be power of 2)
 * @param {number} [format=VTF_FORMATS.RGBA8888] - VTF format constant from VTF_FORMATS
 * @param {boolean|Object} [generateMipsOrOptions=true] - Whether to generate mipmaps, or options object
 * @param {boolean} [generateMipsOrOptions.generateMips=true] - Generate mipmaps
 * @param {number|null} [generateMipsOrOptions.flags=null] - VTF flags (auto-detected if null)
 * @param {boolean} [generateMipsOrOptions.calculateReflectivityValue=true] - Calculate reflectivity from image
 * @param {number} [generateMipsOrOptions.frames=1] - Number of animation frames
 * @param {number} [generateMipsOrOptions.bumpmapScale=1.0] - Bumpmap scale
 * @returns {Buffer} VTF file data
 */
function convertRGBAToVTF(rgbaData, width, height, format = VTF_FORMATS.RGBA8888, generateMipsOrOptions = true) {
  // Handle legacy boolean parameter or new options object
  let options = {};
  if (typeof generateMipsOrOptions === 'boolean') {
    options.generateMips = generateMipsOrOptions;
  } else if (typeof generateMipsOrOptions === 'object') {
    options = generateMipsOrOptions;
  }

  const {
    generateMips = true,
    flags = null,
    calculateReflectivityValue = true,
    frames = 1,
    bumpmapScale = 1.0
  } = options;

  // Validate dimensions
  if (!isPowerOf2(width) || !isPowerOf2(height)) {
    console.warn(`Warning: Dimensions ${width}x${height} are not powers of 2. Some Source engine versions may not load this correctly.`);
  }

  const isDXTFormat = [VTF_FORMATS.DXT1, VTF_FORMATS.DXT1_ONEBITALPHA, VTF_FORMATS.DXT3, VTF_FORMATS.DXT5].includes(format);

  let pixelDataBuffers;

  if (generateMips) {
    // Generate mipmap chain (in RGBA format)
    const mipmaps = generateMipmaps(rgbaData, width, height);

    if (isDXTFormat) {
      // For DXT formats, compress each mipmap level
      pixelDataBuffers = [];
      let mipW = 1, mipH = 1;
      // Calculate dimensions for each mipmap level (mipmaps are smallest to largest)
      const mipDimensions = [];
      let w = width, h = height;
      while (w >= 1 || h >= 1) {
        mipDimensions.unshift({ w: Math.max(1, w), h: Math.max(1, h) });
        if (w === 1 && h === 1) break;
        w = Math.max(1, Math.floor(w / 2));
        h = Math.max(1, Math.floor(h / 2));
      }

      for (let i = 0; i < mipmaps.length; i++) {
        const { w: mipWidth, h: mipHeight } = mipDimensions[i];
        const compressed = compressToDXT(mipmaps[i], mipWidth, mipHeight, format);
        pixelDataBuffers.push(compressed);
      }
    } else {
      // Convert each mipmap to target format
      pixelDataBuffers = convertMipmapsToFormat(mipmaps, format);
    }
  } else {
    // Single level, no mipmaps
    if (isDXTFormat) {
      const compressed = compressToDXT(rgbaData, width, height, format);
      pixelDataBuffers = [compressed];
    } else {
      const pixelData = convertToFormat(rgbaData, format);
      pixelDataBuffers = [pixelData];
    }
  }

  // Calculate reflectivity if requested
  const reflectivity = calculateReflectivityValue
    ? calculateReflectivity(rgbaData)
    : [0, 0, 0];

  // Create header with options
  const header = createVTFHeader(width, height, format, {
    mipmaps: generateMips,
    flags,
    frames,
    reflectivity,
    bumpmapScale
  });

  return Buffer.concat([header, ...pixelDataBuffers]);
}

/**
 * Convert a PNG file to VTF format
 * @param {string} inputPath - Path to input PNG file
 * @param {string} outputPath - Path to output VTF file
 * @param {Object} [options] - Conversion options
 * @param {number} [options.format=VTF_FORMATS.RGBA8888] - VTF format from VTF_FORMATS
 * @param {number} [options.width] - Target width (should be power of 2)
 * @param {number} [options.height] - Target height (should be power of 2)
 * @param {boolean} [options.generateMips=true] - Generate mipmaps
 * @param {number} [options.flags] - VTF flags (auto-detected if not specified)
 * @param {boolean} [options.clampToPowerOf2=false] - Resize to nearest power of 2
 * @returns {Promise<{width: number, height: number, format: number}>} Conversion result info
 */
async function convertPNGToVTF(inputPath, outputPath, options = {}) {
  const format = options.format !== undefined ? options.format : VTF_FORMATS.RGBA8888;
  const generateMips = options.generateMips !== undefined ? options.generateMips : true;
  const clampToPowerOf2 = options.clampToPowerOf2 || false;

  // Load the image with sharp
  let image = sharp(inputPath);
  const metadata = await image.metadata();

  let width = options.width || metadata.width;
  let height = options.height || metadata.height;

  // Optionally clamp to power of 2
  if (clampToPowerOf2 && (!isPowerOf2(width) || !isPowerOf2(height))) {
    width = nextPowerOf2(width);
    height = nextPowerOf2(height);
  }

  // Resize if dimensions were specified or clamped
  if (width !== metadata.width || height !== metadata.height) {
    image = image.resize(width, height, { fit: 'fill' });
  }

  // Get raw RGBA pixel data
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  width = info.width;
  height = info.height;

  // Convert to VTF
  const vtfData = convertRGBAToVTF(data, width, height, format, {
    generateMips,
    flags: options.flags,
    calculateReflectivityValue: true
  });

  // Write to file
  fs.writeFileSync(outputPath, vtfData);

  return { width, height, format };
}

/**
 * Convert a PNG buffer to VTF format
 * @param {Buffer} pngBuffer - PNG image data as a buffer
 * @param {Object} [options] - Conversion options
 * @param {number} [options.format=VTF_FORMATS.RGBA8888] - VTF format from VTF_FORMATS
 * @param {number} [options.width] - Target width (should be power of 2)
 * @param {number} [options.height] - Target height (should be power of 2)
 * @param {boolean} [options.generateMips=true] - Generate mipmaps
 * @param {number} [options.flags] - VTF flags (auto-detected if not specified)
 * @param {boolean} [options.clampToPowerOf2=false] - Resize to nearest power of 2
 * @returns {Promise<Buffer>} VTF file buffer
 */
async function convertPNGBufferToVTF(pngBuffer, options = {}) {
  const format = options.format !== undefined ? options.format : VTF_FORMATS.RGBA8888;
  const generateMips = options.generateMips !== undefined ? options.generateMips : true;
  const clampToPowerOf2 = options.clampToPowerOf2 || false;

  // Load the image with sharp
  let image = sharp(pngBuffer);
  const metadata = await image.metadata();

  let width = options.width || metadata.width;
  let height = options.height || metadata.height;

  // Optionally clamp to power of 2
  if (clampToPowerOf2 && (!isPowerOf2(width) || !isPowerOf2(height))) {
    width = nextPowerOf2(width);
    height = nextPowerOf2(height);
  }

  // Resize if dimensions were specified or clamped
  if (width !== metadata.width || height !== metadata.height) {
    image = image.resize(width, height, { fit: 'fill' });
  }

  // Get raw RGBA pixel data
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  width = info.width;
  height = info.height;

  // Convert to VTF
  return convertRGBAToVTF(data, width, height, format, {
    generateMips,
    flags: options.flags,
    calculateReflectivityValue: true
  });
}

// ============================================================================
// Exports
// ============================================================================

module.exports = {
  VTF_FORMATS,
  VTF_FLAGS,
  convertPNGToVTF,
  convertPNGBufferToVTF,
  convertRGBAToVTF,
  createVTFHeader,
  // Utility functions
  isPowerOf2,
  nextPowerOf2,
  getBytesPerPixel,
  calculateMipmapCount,
  // Format conversion utilities (for advanced users)
  convertToFormat,
  generateMipmaps,
  // DXT compression utilities
  compressToDXT,
  calculateDXTSize
};
