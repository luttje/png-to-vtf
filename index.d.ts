/**
 * PNG to VTF (Valve Texture Format) Converter
 *
 * Converts PNG images to VTF format files for use in Source engine games.
 * Works in both Node.js and browser environments.
 * Implements VTF version 7.2 with 80-byte headers.
 */

// Environment detection
/** Whether the code is running in a browser environment */
export const isBrowser: boolean;
/** Whether the code is running in a Node.js environment */
export const isNode: boolean;

/**
 * VTF Image Formats
 * These correspond to the IMAGE_FORMAT enum in the VTF specification
 */
export const VTF_FORMATS: {
  /** 32-bit RGBA (8 bits per channel) */
  RGBA8888: 0;
  /** 32-bit ABGR (8 bits per channel) */
  ABGR8888: 1;
  /** 24-bit RGB (8 bits per channel, no alpha) */
  RGB888: 2;
  /** 24-bit BGR (8 bits per channel, no alpha) - preferred for opaque */
  BGR888: 3;
  /** 16-bit RGB (5-6-5 bits per channel) */
  RGB565: 4;
  /** 8-bit luminance (grayscale) */
  I8: 5;
  /** 16-bit luminance + alpha (8 bits each) */
  IA88: 6;
  /** 8-bit paletted (not supported by engine) */
  P8: 7;
  /** 8-bit alpha only */
  A8: 8;
  /** RGB with blue = transparent */
  RGB888_BLUESCREEN: 9;
  /** BGR with blue = transparent */
  BGR888_BLUESCREEN: 10;
  /** 32-bit ARGB */
  ARGB8888: 11;
  /** 32-bit BGRA (8 bits per channel) - common format */
  BGRA8888: 12;
  /** DXT1/BC1 block compression (4 bpp) */
  DXT1: 13;
  /** DXT3/BC2 block compression (8 bpp, sharp alpha) */
  DXT3: 14;
  /** DXT5/BC3 block compression (8 bpp, smooth alpha) */
  DXT5: 15;
  /** 32-bit BGR with unused alpha */
  BGRX8888: 16;
  /** 16-bit BGR (5-6-5 bits) - preferred over RGB565 */
  BGR565: 17;
  /** 16-bit BGR with unused alpha bit */
  BGRX5551: 18;
  /** 16-bit BGRA (4 bits per channel) */
  BGRA4444: 19;
  /** DXT1 with 1-bit alpha */
  DXT1_ONEBITALPHA: 20;
  /** 16-bit BGRA (5-5-5-1 bits per channel) */
  BGRA5551: 21;
  /** 16-bit du/dv format for bump maps */
  UV88: 22;
  /** 32-bit du/dv format */
  UVWQ8888: 23;
  /** 64-bit floating point RGBA (HDR) */
  RGBA16161616F: 24;
  /** 64-bit integer RGBA (HDR) */
  RGBA16161616: 25;
  /** 32-bit du/dv/luminance format */
  UVLX8888: 26;
};

/**
 * VTF Texture Flags
 * These control how the texture is processed and displayed
 */
export const VTF_FLAGS: {
  POINTSAMPLE: 0x0001;
  TRILINEAR: 0x0002;
  CLAMPS: 0x0004;
  CLAMPT: 0x0008;
  ANISOTROPIC: 0x0010;
  HINT_DXT5: 0x0020;
  PWL_CORRECTED: 0x0040;
  NORMAL: 0x0080;
  NOMIP: 0x0100;
  NOLOD: 0x0200;
  ALL_MIPS: 0x0400;
  PROCEDURAL: 0x0800;
  ONEBITALPHA: 0x1000;
  EIGHTBITALPHA: 0x2000;
  ENVMAP: 0x4000;
  RENDERTARGET: 0x8000;
  DEPTHRENDERTARGET: 0x10000;
  NODEBUGOVERRIDE: 0x20000;
  SINGLECOPY: 0x40000;
  PRE_SRGB: 0x80000;
  NODEPTHBUFFER: 0x800000;
  CLAMPU: 0x2000000;
  VERTEXTEXTURE: 0x4000000;
  SSBUMP: 0x8000000;
  BORDER: 0x20000000;
};

export type VTFFormat = typeof VTF_FORMATS[keyof typeof VTF_FORMATS];
export type VTFFlag = typeof VTF_FLAGS[keyof typeof VTF_FLAGS];

export interface ConversionOptions {
  /** VTF format (default: RGBA8888) */
  format?: VTFFormat;
  /** Target width (should be power of 2) */
  width?: number;
  /** Target height (should be power of 2) */
  height?: number;
  /** Generate mipmaps (default: true) */
  generateMips?: boolean;
  /** VTF flags (auto-detected if not specified) */
  flags?: number;
  /** Resize to nearest power of 2 (default: false) */
  clampToPowerOf2?: boolean;
}

export interface ConversionResult {
  /** Output image width */
  width: number;
  /** Output image height */
  height: number;
  /** VTF format used */
  format: VTFFormat;
}

export interface VTFHeaderOptions {
  /** Whether mipmaps are included */
  mipmaps?: boolean;
  /** VTF flags */
  flags?: number | null;
  /** Number of animation frames */
  frames?: number;
  /** First frame index */
  firstFrame?: number;
  /** Reflectivity RGB [r, g, b] normalized 0-1 */
  reflectivity?: [number, number, number];
  /** Bumpmap scale */
  bumpmapScale?: number;
  /** Texture depth (for volumetric textures) */
  depth?: number;
}

export interface RGBAToVTFOptions {
  /** Generate mipmaps (default: true) */
  generateMips?: boolean;
  /** VTF flags (auto-detected if not specified) */
  flags?: number | null;
  /** Calculate reflectivity from image (default: true) */
  calculateReflectivityValue?: boolean;
  /** Number of animation frames */
  frames?: number;
  /** Bumpmap scale */
  bumpmapScale?: number;
}

/**
 * Convert a PNG file to VTF format (Node.js only - requires sharp)
 * @param inputPath - Path to input PNG file
 * @param outputPath - Path to output VTF file
 * @param options - Conversion options
 * @returns Conversion result info
 * @throws Error if sharp is not available (browser environment)
 */
export function convertPNGToVTF(
  inputPath: string,
  outputPath: string,
  options?: ConversionOptions
): Promise<ConversionResult>;

/**
 * Convert a PNG buffer to VTF format (Node.js only - requires sharp)
 * @param pngBuffer - PNG image buffer
 * @param options - Conversion options
 * @returns VTF file buffer
 * @throws Error if sharp is not available (browser environment)
 */
export function convertPNGBufferToVTF(
  pngBuffer: Buffer,
  options?: ConversionOptions
): Promise<Buffer>;

/**
 * Convert raw RGBA pixel data to VTF format
 * Works in both Node.js and browser environments
 * @param rgbaData - Raw RGBA pixel data
 * @param width - Image width
 * @param height - Image height
 * @param format - VTF format constant (default: RGBA8888)
 * @param generateMipsOrOptions - Whether to generate mipmaps (boolean) or options object
 * @returns VTF file data
 */
export function convertRGBAToVTF(
  rgbaData: Buffer | Uint8Array,
  width: number,
  height: number,
  format?: VTFFormat,
  generateMipsOrOptions?: boolean | RGBAToVTFOptions
): Buffer | Uint8Array;

/**
 * Create VTF header according to VTF 7.2 specification
 * @param width - Image width
 * @param height - Image height
 * @param format - VTF format constant
 * @param options - Header options
 * @returns VTF header (80 bytes)
 */
export function createVTFHeader(
  width: number,
  height: number,
  format: VTFFormat,
  options?: VTFHeaderOptions
): Buffer;

// Utility functions

/**
 * Check if a number is a power of 2
 */
export function isPowerOf2(n: number): boolean;

/**
 * Get the next power of 2 greater than or equal to n
 */
export function nextPowerOf2(n: number): number;

/**
 * Get bytes per pixel for a given format
 */
export function getBytesPerPixel(format: VTFFormat): number;

/**
 * Calculate number of mipmap levels needed
 */
export function calculateMipmapCount(width: number, height: number): number;

/**
 * Convert RGBA data to the specified VTF format
 */
export function convertToFormat(rgbaData: Buffer, format: VTFFormat): Buffer;

/**
 * Generate mipmap chain from RGBA data
 * Returns array of buffers from smallest to largest (VTF order)
 */
export function generateMipmaps(rgbaData: Buffer, width: number, height: number): Buffer[];

// DXT compression utilities

/**
 * Compress RGBA data to DXT format
 * @param rgbaData - RGBA pixel data
 * @param width - Image width
 * @param height - Image height
 * @param format - VTF DXT format (DXT1, DXT3, DXT5)
 * @returns DXT compressed data
 */
export function compressToDXT(
  rgbaData: Buffer,
  width: number,
  height: number,
  format: VTFFormat
): Buffer;

/**
 * Calculate DXT compressed data size
 * @param width - Image width
 * @param height - Image height
 * @param format - VTF DXT format
 * @returns Size in bytes
 */
export function calculateDXTSize(width: number, height: number, format: VTFFormat): number;

// ============================================================================
// Browser-Compatible Functions and Classes
// ============================================================================

/** Options for ImageData to VTF conversion */
export interface ImageDataConversionOptions {
  /** VTF format (default: RGBA8888) */
  format?: VTFFormat;
  /** Generate mipmaps (default: true) */
  generateMips?: boolean;
  /** VTF flags (auto-detected if not specified) */
  flags?: number;
}

/** Options for CanvasToVTF class */
export interface CanvasToVTFOptions {
  /** VTF format (default: RGBA8888) */
  format?: VTFFormat;
  /** Generate mipmaps (default: true) */
  mipmaps?: boolean;
  /** VTF flags (auto-detected if not specified) */
  flags?: number;
}

/**
 * Convert ImageData (from Canvas) to VTF format
 * Works in both Node.js and browser environments
 * @param imageData - ImageData object from canvas getImageData()
 * @param options - Conversion options
 * @returns VTF file data
 */
export function convertImageDataToVTF(
  imageData: ImageData | { data: Uint8ClampedArray; width: number; height: number },
  options?: ImageDataConversionOptions
): Uint8Array;

/**
 * Canvas to VTF converter class (Browser-friendly)
 * Converts HTML5 Canvas images to Valve Texture Format (VTF) files
 */
export class CanvasToVTF {
  /**
   * Create a VTF converter
   * @param options - Conversion options
   */
  constructor(options?: CanvasToVTFOptions);

  /** VTF format to use */
  format: VTFFormat;
  /** Whether to generate mipmaps */
  mipmaps: boolean;
  /** VTF flags */
  flags?: number;

  /**
   * Convert canvas to VTF format
   * @param canvas - Source canvas
   * @returns VTF file data
   */
  convertCanvas(canvas: HTMLCanvasElement): Uint8Array;

  /**
   * Convert ImageData to VTF format
   * @param imageData - Source image data
   * @returns VTF file data
   */
  convertImageData(imageData: ImageData): Uint8Array;

  /**
   * Convert canvas to VTF and trigger download (browser only)
   * @param canvas - Source canvas element
   * @param filename - Output filename without extension
   */
  downloadFromCanvas(canvas: HTMLCanvasElement, filename?: string): void;
}

/**
 * Download VTF data as a file (browser only)
 * @param vtfData - VTF file data
 * @param filename - Filename without extension
 */
export function downloadVTF(vtfData: Uint8Array, filename?: string): void;

/**
 * Quick convert and download canvas to VTF (browser only)
 * Convenience function for simple conversions
 * @param canvas - Source canvas element
 * @param filename - Output filename without extension
 * @param format - VTF format constant from VTF_FORMATS
 * @param options - Additional options
 */
export function canvasToVTF(
  canvas: HTMLCanvasElement,
  filename?: string,
  format?: VTFFormat,
  options?: { mipmaps?: boolean }
): void;

/**
 * Resize an image using Canvas API (browser only)
 * @param source - Source image element
 * @param width - Target width
 * @param height - Target height
 * @returns Resized image data
 */
export function resizeImageBrowser(
  source: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  width: number,
  height: number
): ImageData;

// ============================================================================
// Cross-Platform Utility Functions
// ============================================================================

/**
 * Create a buffer that works in both Node.js and browser
 * @param size - Size in bytes
 * @returns Buffer (Node.js) or Uint8Array (browser)
 */
export function createBuffer(size: number): Buffer | Uint8Array;

/**
 * Concatenate multiple buffers into one
 * Works in both Node.js and browser
 * @param buffers - Array of buffers to concatenate
 * @returns Concatenated buffer
 */
export function concatBuffers(buffers: Array<Buffer | Uint8Array>): Buffer | Uint8Array;

// Browser global declaration
declare global {
  interface Window {
    PNGToVTF: typeof import('./index');
  }
}
