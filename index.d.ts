/**
 * PNG to VTF (Valve Texture Format) Converter
 * 
 * Converts PNG images to VTF format files for use in Source engine games.
 */

/**
 * VTF Image Formats
 */
export const VTF_FORMATS: {
  /** 32-bit RGBA (8 bits per channel) */
  RGBA8888: 0;
  /** 24-bit RGB (8 bits per channel, no alpha) */
  RGB888: 2;
  /** 16-bit RGB (5-6-5 bits per channel) */
  RGB565: 4;
  /** DXT1 block compression (not implemented) */
  DXT1: 13;
  /** DXT5 block compression with alpha (not implemented) */
  DXT5: 15;
  /** 16-bit BGRA (5-5-5-1 bits per channel) */
  BGRA5551: 21;
  /** 16-bit BGRA (4 bits per channel) */
  BGRA4444: 19;
};

export type VTFFormat = typeof VTF_FORMATS[keyof typeof VTF_FORMATS];

export interface ConversionOptions {
  /** VTF format (default: RGBA8888) */
  format?: VTFFormat;
  /** Target width (should be power of 2) */
  width?: number;
  /** Target height (should be power of 2) */
  height?: number;
}

export interface ConversionResult {
  /** Output image width */
  width: number;
  /** Output image height */
  height: number;
  /** VTF format used */
  format: VTFFormat;
}

/**
 * Convert a PNG file to VTF format
 * @param inputPath - Path to input PNG file
 * @param outputPath - Path to output VTF file
 * @param options - Conversion options
 * @returns Conversion result info
 */
export function convertPNGToVTF(
  inputPath: string,
  outputPath: string,
  options?: ConversionOptions
): Promise<ConversionResult>;

/**
 * Convert a PNG buffer to VTF format
 * @param pngBuffer - PNG image buffer
 * @param options - Conversion options
 * @returns VTF file buffer
 */
export function convertPNGBufferToVTF(
  pngBuffer: Buffer,
  options?: ConversionOptions
): Promise<Buffer>;

/**
 * Convert raw RGBA pixel data to VTF format
 * @param rgbaData - Raw RGBA pixel data
 * @param width - Image width
 * @param height - Image height
 * @param format - VTF format constant (default: RGBA8888)
 * @param generateMips - Whether to generate mipmaps (default: true)
 * @returns VTF file data
 */
export function convertRGBAToVTF(
  rgbaData: Buffer,
  width: number,
  height: number,
  format?: VTFFormat,
  generateMips?: boolean
): Buffer;

/**
 * Create VTF header according to VTF 7.1 specification
 * @param width - Image width
 * @param height - Image height
 * @param format - VTF format constant
 * @param mipmaps - Whether mipmaps are included
 * @returns VTF header (64 bytes)
 */
export function createVTFHeader(
  width: number,
  height: number,
  format: VTFFormat,
  mipmaps?: boolean
): Buffer;
