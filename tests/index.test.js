import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  convertPNGToVTF,
  convertPNGBufferToVTF,
  convertRGBAToVTF,
  createVTFHeader,
  VTF_FORMATS,
  VTF_FLAGS,
  isPowerOf2,
  nextPowerOf2,
  getBytesPerPixel,
  calculateMipmapCount,
  convertToFormat,
  generateMipmaps,
  compressToDXT,
  calculateDXTSize
} from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const EXPECTED_DIR = path.join(__dirname, 'expected');
const OUTPUT_DIR = path.join(__dirname, 'output');
const TEST_PNG = path.join(FIXTURES_DIR, 'action_noclip.png');

// ============================================================================
// Setup and Teardown
// ============================================================================

beforeAll(() => {
  // Create output directory for test results
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
});

afterAll(() => {
  // Clean up output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR);
    for (const file of files) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
    fs.rmdirSync(OUTPUT_DIR);
  }
});

// ============================================================================
// Utility Function Tests
// ============================================================================

describe('Utility Functions', () => {
  describe('isPowerOf2', () => {
    it('should return true for powers of 2', () => {
      expect(isPowerOf2(1)).toBe(true);
      expect(isPowerOf2(2)).toBe(true);
      expect(isPowerOf2(4)).toBe(true);
      expect(isPowerOf2(16)).toBe(true);
      expect(isPowerOf2(256)).toBe(true);
      expect(isPowerOf2(1024)).toBe(true);
      expect(isPowerOf2(4096)).toBe(true);
    });

    it('should return false for non-powers of 2', () => {
      expect(isPowerOf2(0)).toBe(false);
      expect(isPowerOf2(3)).toBe(false);
      expect(isPowerOf2(5)).toBe(false);
      expect(isPowerOf2(100)).toBe(false);
      expect(isPowerOf2(300)).toBe(false);
      expect(isPowerOf2(-4)).toBe(false);
    });
  });

  describe('nextPowerOf2', () => {
    it('should return the same value for powers of 2', () => {
      expect(nextPowerOf2(1)).toBe(1);
      expect(nextPowerOf2(2)).toBe(2);
      expect(nextPowerOf2(256)).toBe(256);
      expect(nextPowerOf2(1024)).toBe(1024);
    });

    it('should return next power of 2 for non-powers', () => {
      expect(nextPowerOf2(3)).toBe(4);
      expect(nextPowerOf2(5)).toBe(8);
      expect(nextPowerOf2(100)).toBe(128);
      expect(nextPowerOf2(300)).toBe(512);
      expect(nextPowerOf2(1025)).toBe(2048);
    });
  });

  describe('getBytesPerPixel', () => {
    it('should return correct bytes for 32-bit formats', () => {
      expect(getBytesPerPixel(VTF_FORMATS.RGBA8888)).toBe(4);
      expect(getBytesPerPixel(VTF_FORMATS.BGRA8888)).toBe(4);
      expect(getBytesPerPixel(VTF_FORMATS.ARGB8888)).toBe(4);
      expect(getBytesPerPixel(VTF_FORMATS.ABGR8888)).toBe(4);
    });

    it('should return correct bytes for 24-bit formats', () => {
      expect(getBytesPerPixel(VTF_FORMATS.RGB888)).toBe(3);
      expect(getBytesPerPixel(VTF_FORMATS.BGR888)).toBe(3);
    });

    it('should return correct bytes for 16-bit formats', () => {
      expect(getBytesPerPixel(VTF_FORMATS.RGB565)).toBe(2);
      expect(getBytesPerPixel(VTF_FORMATS.BGR565)).toBe(2);
      expect(getBytesPerPixel(VTF_FORMATS.BGRA4444)).toBe(2);
      expect(getBytesPerPixel(VTF_FORMATS.BGRA5551)).toBe(2);
      expect(getBytesPerPixel(VTF_FORMATS.IA88)).toBe(2);
    });

    it('should return correct bytes for 8-bit formats', () => {
      expect(getBytesPerPixel(VTF_FORMATS.I8)).toBe(1);
      expect(getBytesPerPixel(VTF_FORMATS.A8)).toBe(1);
    });
  });

  describe('calculateMipmapCount', () => {
    it('should calculate correct mipmap count', () => {
      expect(calculateMipmapCount(1, 1)).toBe(1);
      expect(calculateMipmapCount(2, 2)).toBe(2);
      expect(calculateMipmapCount(4, 4)).toBe(3);
      expect(calculateMipmapCount(256, 256)).toBe(9);
      expect(calculateMipmapCount(1024, 1024)).toBe(11);
    });

    it('should handle non-square dimensions', () => {
      expect(calculateMipmapCount(256, 128)).toBe(9);
      expect(calculateMipmapCount(512, 64)).toBe(10);
    });
  });
});

// ============================================================================
// VTF Header Tests
// ============================================================================

describe('VTF Header', () => {
  it('should create an 80-byte header for VTF 7.2', () => {
    const header = createVTFHeader(256, 256, VTF_FORMATS.RGBA8888);
    expect(header.length).toBe(80);
  });

  it('should have correct VTF signature', () => {
    const header = createVTFHeader(256, 256, VTF_FORMATS.RGBA8888);
    expect(header[0]).toBe(0x56); // 'V'
    expect(header[1]).toBe(0x54); // 'T'
    expect(header[2]).toBe(0x46); // 'F'
    expect(header[3]).toBe(0x00); // null
  });

  it('should have version 7.2', () => {
    const header = createVTFHeader(256, 256, VTF_FORMATS.RGBA8888);
    // Major version at offset 4 (uint32 LE)
    expect(header.readUInt32LE(4)).toBe(7);
    // Minor version at offset 8 (uint32 LE)
    expect(header.readUInt32LE(8)).toBe(2);
  });

  it('should store correct dimensions', () => {
    const header = createVTFHeader(512, 256, VTF_FORMATS.RGBA8888);
    expect(header.readUInt16LE(16)).toBe(512); // width
    expect(header.readUInt16LE(18)).toBe(256); // height
  });

  it('should store correct format', () => {
    const header = createVTFHeader(256, 256, VTF_FORMATS.BGR888);
    expect(header.readUInt32LE(52)).toBe(VTF_FORMATS.BGR888);
  });

  it('should set EIGHTBITALPHA flag for alpha formats', () => {
    const header = createVTFHeader(256, 256, VTF_FORMATS.BGRA8888);
    const flags = header.readUInt32LE(20);
    expect(flags & VTF_FLAGS.EIGHTBITALPHA).toBe(VTF_FLAGS.EIGHTBITALPHA);
  });

  it('should set ONEBITALPHA flag for 1-bit alpha formats', () => {
    const header = createVTFHeader(256, 256, VTF_FORMATS.BGRA5551);
    const flags = header.readUInt32LE(20);
    expect(flags & VTF_FLAGS.ONEBITALPHA).toBe(VTF_FLAGS.ONEBITALPHA);
  });

  it('should use custom flags when provided', () => {
    const customFlags = VTF_FLAGS.TRILINEAR | VTF_FLAGS.ANISOTROPIC;
    const header = createVTFHeader(256, 256, VTF_FORMATS.BGR888, { flags: customFlags });
    const flags = header.readUInt32LE(20);
    expect(flags).toBe(customFlags);
  });

  it('should set correct mipmap count', () => {
    const header = createVTFHeader(256, 256, VTF_FORMATS.RGBA8888, { mipmaps: true });
    expect(header[56]).toBe(9); // 256 -> 9 mipmap levels
  });
});

// ============================================================================
// Format Conversion Tests
// ============================================================================

describe('Format Conversion', () => {
  // Create a simple 2x2 RGBA test image
  const testRGBA = Buffer.from([
    255, 0, 0, 255,     // Red
    0, 255, 0, 255,     // Green
    0, 0, 255, 255,     // Blue
    255, 255, 255, 128  // White semi-transparent
  ]);

  describe('convertToFormat', () => {
    it('should pass through RGBA8888 unchanged', () => {
      const result = convertToFormat(testRGBA, VTF_FORMATS.RGBA8888);
      expect(result).toEqual(testRGBA);
    });

    it('should convert RGBA to BGRA8888 (swap R and B)', () => {
      const result = convertToFormat(testRGBA, VTF_FORMATS.BGRA8888);
      expect(result.length).toBe(16);
      // First pixel: Red -> BGR order should be (0, 0, 255, 255)
      expect(result[0]).toBe(0);   // B
      expect(result[1]).toBe(0);   // G
      expect(result[2]).toBe(255); // R
      expect(result[3]).toBe(255); // A
    });

    it('should convert RGBA to BGR888 (strip alpha, swap R/B)', () => {
      const result = convertToFormat(testRGBA, VTF_FORMATS.BGR888);
      expect(result.length).toBe(12); // 4 pixels * 3 bytes
      // First pixel: Red -> (0, 0, 255)
      expect(result[0]).toBe(0);   // B
      expect(result[1]).toBe(0);   // G
      expect(result[2]).toBe(255); // R
    });

    it('should convert RGBA to RGB888 (strip alpha)', () => {
      const result = convertToFormat(testRGBA, VTF_FORMATS.RGB888);
      expect(result.length).toBe(12);
      // First pixel: Red
      expect(result[0]).toBe(255); // R
      expect(result[1]).toBe(0);   // G
      expect(result[2]).toBe(0);   // B
    });

    it('should convert RGBA to I8 (grayscale)', () => {
      const result = convertToFormat(testRGBA, VTF_FORMATS.I8);
      expect(result.length).toBe(4); // 4 pixels * 1 byte
      // Red should be ~76 (0.299 * 255)
      expect(result[0]).toBeCloseTo(76, 0);
      // Green should be ~150 (0.587 * 255)
      expect(result[1]).toBeCloseTo(150, 0);
      // Blue should be ~29 (0.114 * 255)
      expect(result[2]).toBeCloseTo(29, 0);
      // White should be 255
      expect(result[3]).toBe(255);
    });

    it('should convert RGBA to IA88 (grayscale + alpha)', () => {
      const result = convertToFormat(testRGBA, VTF_FORMATS.IA88);
      expect(result.length).toBe(8); // 4 pixels * 2 bytes
      // Last pixel (white semi-transparent)
      expect(result[6]).toBe(255); // I (white)
      expect(result[7]).toBe(128); // A (semi-transparent)
    });

    it('should convert RGBA to A8 (alpha only)', () => {
      const result = convertToFormat(testRGBA, VTF_FORMATS.A8);
      expect(result.length).toBe(4);
      expect(result[0]).toBe(255); // Full alpha
      expect(result[1]).toBe(255);
      expect(result[2]).toBe(255);
      expect(result[3]).toBe(128); // Semi-transparent
    });

    it('should throw error for DXT formats (use compressToDXT instead)', () => {
      // convertToFormat doesn't handle DXT because it needs width/height
      expect(() => convertToFormat(testRGBA, VTF_FORMATS.DXT1)).toThrow();
      expect(() => convertToFormat(testRGBA, VTF_FORMATS.DXT5)).toThrow();
    });
  });
});

// ============================================================================
// Mipmap Generation Tests
// ============================================================================

describe('Mipmap Generation', () => {
  it('should generate correct number of mipmap levels', () => {
    const rgba = Buffer.alloc(256 * 256 * 4, 128);
    const mipmaps = generateMipmaps(rgba, 256, 256);
    expect(mipmaps.length).toBe(9); // 256, 128, 64, 32, 16, 8, 4, 2, 1
  });

  it('should return mipmaps from smallest to largest (VTF order)', () => {
    const rgba = Buffer.alloc(16 * 16 * 4, 128);
    const mipmaps = generateMipmaps(rgba, 16, 16);

    // First should be 1x1
    expect(mipmaps[0].length).toBe(4);
    // Last should be 16x16
    expect(mipmaps[mipmaps.length - 1].length).toBe(16 * 16 * 4);
  });

  it('should handle non-square dimensions', () => {
    const rgba = Buffer.alloc(64 * 32 * 4, 128);
    const mipmaps = generateMipmaps(rgba, 64, 32);

    // Should have 7 levels: 64x32, 32x16, 16x8, 8x4, 4x2, 2x1, 1x1
    expect(mipmaps.length).toBe(7);
  });
});

// ============================================================================
// VTF Conversion Tests
// ============================================================================

describe('convertRGBAToVTF', () => {
  it('should create valid VTF data without mipmaps', () => {
    const rgba = Buffer.alloc(4 * 4 * 4, 200); // 4x4 gray image
    const vtf = convertRGBAToVTF(rgba, 4, 4, VTF_FORMATS.RGBA8888, false);

    // Header (80) + pixel data (4*4*4 = 64)
    expect(vtf.length).toBe(80 + 64);

    // Check signature
    expect(vtf.toString('ascii', 0, 3)).toBe('VTF');
  });

  it('should create valid VTF data with mipmaps', () => {
    const rgba = Buffer.alloc(8 * 8 * 4, 200);
    const vtf = convertRGBAToVTF(rgba, 8, 8, VTF_FORMATS.RGBA8888, true);

    // Header (80) + mipmaps (1x1 + 2x2 + 4x4 + 8x8) * 4 bytes
    // = 80 + (4 + 16 + 64 + 256) = 80 + 340 = 420
    expect(vtf.length).toBe(420);
  });

  it('should support options object instead of boolean', () => {
    const rgba = Buffer.alloc(4 * 4 * 4, 200);
    const vtf = convertRGBAToVTF(rgba, 4, 4, VTF_FORMATS.RGBA8888, {
      generateMips: false,
      flags: VTF_FLAGS.TRILINEAR
    });

    expect(vtf.length).toBe(80 + 64);
    expect(vtf.readUInt32LE(20)).toBe(VTF_FLAGS.TRILINEAR);
  });

  it('should warn for non-power-of-2 dimensions', () => {
    const rgba = Buffer.alloc(5 * 5 * 4, 200);
    // Should not throw, just warn
    expect(() => convertRGBAToVTF(rgba, 5, 5, VTF_FORMATS.RGBA8888, false)).not.toThrow();
  });
});

// ============================================================================
// PNG Conversion Tests (using real test image)
// ============================================================================

describe('PNG to VTF Conversion', () => {
  it('should convert PNG file to VTF file', async () => {
    const outputPath = path.join(OUTPUT_DIR, 'test_output.vtf');

    const result = await convertPNGToVTF(TEST_PNG, outputPath);

    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
    expect(result.format).toBe(VTF_FORMATS.RGBA8888);

    // Verify file was created
    expect(fs.existsSync(outputPath)).toBe(true);

    // Verify VTF signature
    const vtfData = fs.readFileSync(outputPath);
    expect(vtfData.toString('ascii', 0, 3)).toBe('VTF');
  });

  it('should convert PNG to different formats', async () => {
    const formats = [
      { format: VTF_FORMATS.BGR888, name: 'bgr888' },
      { format: VTF_FORMATS.BGRA8888, name: 'bgra8888' },
      { format: VTF_FORMATS.I8, name: 'i8' },
      { format: VTF_FORMATS.BGR565, name: 'bgr565' }
    ];

    for (const { format, name } of formats) {
      const outputPath = path.join(OUTPUT_DIR, `test_${name}.vtf`);

      const result = await convertPNGToVTF(TEST_PNG, outputPath, { format });

      expect(result.format).toBe(format);
      expect(fs.existsSync(outputPath)).toBe(true);

      const vtfData = fs.readFileSync(outputPath);
      expect(vtfData.readUInt32LE(52)).toBe(format);
    }
  });

  it('should resize and clamp to power of 2', async () => {
    const outputPath = path.join(OUTPUT_DIR, 'test_resized.vtf');

    const result = await convertPNGToVTF(TEST_PNG, outputPath, {
      width: 64,
      height: 64
    });

    expect(result.width).toBe(64);
    expect(result.height).toBe(64);
  });

  it('should convert PNG buffer to VTF buffer', async () => {
    const pngBuffer = fs.readFileSync(TEST_PNG);

    const vtfBuffer = await convertPNGBufferToVTF(pngBuffer, {
      format: VTF_FORMATS.BGRA8888
    });

    expect(Buffer.isBuffer(vtfBuffer)).toBe(true);
    expect(vtfBuffer.toString('ascii', 0, 3)).toBe('VTF');
    expect(vtfBuffer.readUInt32LE(52)).toBe(VTF_FORMATS.BGRA8888);
  });

  it('should generate mipmaps by default', async () => {
    const outputPath = path.join(OUTPUT_DIR, 'test_mipmaps.vtf');

    await convertPNGToVTF(TEST_PNG, outputPath, {
      width: 64,
      height: 64
    });

    const vtfData = fs.readFileSync(outputPath);
    const mipmapCount = vtfData[56];

    // 64x64 should have 7 mipmap levels
    expect(mipmapCount).toBe(7);
  });

  it('should skip mipmaps when generateMips is false', async () => {
    const outputPath = path.join(OUTPUT_DIR, 'test_no_mipmaps.vtf');

    await convertPNGToVTF(TEST_PNG, outputPath, {
      width: 64,
      height: 64,
      generateMips: false
    });

    const vtfData = fs.readFileSync(outputPath);
    const mipmapCount = vtfData[56];

    expect(mipmapCount).toBe(1);
  });
});

// ============================================================================
// VTF Flags Tests
// ============================================================================

describe('VTF Flags', () => {
  it('should have correct flag values', () => {
    expect(VTF_FLAGS.POINTSAMPLE).toBe(0x0001);
    expect(VTF_FLAGS.TRILINEAR).toBe(0x0002);
    expect(VTF_FLAGS.CLAMPS).toBe(0x0004);
    expect(VTF_FLAGS.CLAMPT).toBe(0x0008);
    expect(VTF_FLAGS.ANISOTROPIC).toBe(0x0010);
    expect(VTF_FLAGS.NORMAL).toBe(0x0080);
    expect(VTF_FLAGS.NOMIP).toBe(0x0100);
    expect(VTF_FLAGS.ONEBITALPHA).toBe(0x1000);
    expect(VTF_FLAGS.EIGHTBITALPHA).toBe(0x2000);
    expect(VTF_FLAGS.ENVMAP).toBe(0x4000);
  });

  it('should allow combining flags with bitwise OR', () => {
    const combined = VTF_FLAGS.TRILINEAR | VTF_FLAGS.ANISOTROPIC | VTF_FLAGS.EIGHTBITALPHA;
    expect(combined).toBe(0x2012);
  });
});

// ============================================================================
// VTF Formats Tests
// ============================================================================

describe('VTF Formats', () => {
  it('should have correct format values matching VTF spec', () => {
    expect(VTF_FORMATS.RGBA8888).toBe(0);
    expect(VTF_FORMATS.ABGR8888).toBe(1);
    expect(VTF_FORMATS.RGB888).toBe(2);
    expect(VTF_FORMATS.BGR888).toBe(3);
    expect(VTF_FORMATS.RGB565).toBe(4);
    expect(VTF_FORMATS.I8).toBe(5);
    expect(VTF_FORMATS.IA88).toBe(6);
    expect(VTF_FORMATS.A8).toBe(8);
    expect(VTF_FORMATS.BGRA8888).toBe(12);
    expect(VTF_FORMATS.DXT1).toBe(13);
    expect(VTF_FORMATS.DXT3).toBe(14);
    expect(VTF_FORMATS.DXT5).toBe(15);
    expect(VTF_FORMATS.BGR565).toBe(17);
    expect(VTF_FORMATS.BGRA4444).toBe(19);
    expect(VTF_FORMATS.BGRA5551).toBe(21);
  });
});

// ============================================================================
// DXT Compression Tests
// ============================================================================

describe('DXT Compression', () => {
  describe('calculateDXTSize', () => {
    it('should calculate correct size for DXT1', () => {
      // 4x4 = 1 block = 8 bytes for DXT1
      expect(calculateDXTSize(4, 4, VTF_FORMATS.DXT1)).toBe(8);
      // 8x8 = 4 blocks = 32 bytes
      expect(calculateDXTSize(8, 8, VTF_FORMATS.DXT1)).toBe(32);
      // 256x256 = 4096 blocks = 32768 bytes
      expect(calculateDXTSize(256, 256, VTF_FORMATS.DXT1)).toBe(32768);
    });

    it('should calculate correct size for DXT5', () => {
      // 4x4 = 1 block = 16 bytes for DXT5
      expect(calculateDXTSize(4, 4, VTF_FORMATS.DXT5)).toBe(16);
      // 8x8 = 4 blocks = 64 bytes
      expect(calculateDXTSize(8, 8, VTF_FORMATS.DXT5)).toBe(64);
      // 256x256 = 4096 blocks = 65536 bytes
      expect(calculateDXTSize(256, 256, VTF_FORMATS.DXT5)).toBe(65536);
    });

    it('should round up to nearest block for non-multiples of 4', () => {
      // 5x5 rounds up to 2x2 blocks = 4 blocks
      expect(calculateDXTSize(5, 5, VTF_FORMATS.DXT1)).toBe(32);
      // 1x1 still needs 1 block minimum
      expect(calculateDXTSize(1, 1, VTF_FORMATS.DXT1)).toBe(8);
    });
  });

  describe('compressToDXT', () => {
    it('should compress 4x4 RGBA to DXT1', () => {
      const rgba = Buffer.alloc(4 * 4 * 4, 128); // 4x4 gray image
      const compressed = compressToDXT(rgba, 4, 4, VTF_FORMATS.DXT1);
      expect(compressed.length).toBe(8); // 1 block = 8 bytes
    });

    it('should compress 4x4 RGBA to DXT5', () => {
      const rgba = Buffer.alloc(4 * 4 * 4, 128);
      const compressed = compressToDXT(rgba, 4, 4, VTF_FORMATS.DXT5);
      expect(compressed.length).toBe(16); // 1 block = 16 bytes
    });

    it('should compress larger images', () => {
      const rgba = Buffer.alloc(64 * 64 * 4, 200);
      const compressedDXT1 = compressToDXT(rgba, 64, 64, VTF_FORMATS.DXT1);
      const compressedDXT5 = compressToDXT(rgba, 64, 64, VTF_FORMATS.DXT5);

      // 64x64 = 16x16 blocks = 256 blocks
      expect(compressedDXT1.length).toBe(256 * 8);  // 2048 bytes
      expect(compressedDXT5.length).toBe(256 * 16); // 4096 bytes
    });
  });

  describe('convertRGBAToVTF with DXT', () => {
    it('should create valid VTF with DXT1 format', () => {
      const rgba = Buffer.alloc(8 * 8 * 4, 180);
      const vtf = convertRGBAToVTF(rgba, 8, 8, VTF_FORMATS.DXT1, false);

      // Check signature
      expect(vtf.toString('ascii', 0, 3)).toBe('VTF');
      // Check format
      expect(vtf.readUInt32LE(52)).toBe(VTF_FORMATS.DXT1);
      // Header (80) + DXT1 data (4 blocks * 8 bytes = 32)
      expect(vtf.length).toBe(80 + 32);
    });

    it('should create valid VTF with DXT5 format', () => {
      const rgba = Buffer.alloc(8 * 8 * 4, 180);
      const vtf = convertRGBAToVTF(rgba, 8, 8, VTF_FORMATS.DXT5, false);

      expect(vtf.toString('ascii', 0, 3)).toBe('VTF');
      expect(vtf.readUInt32LE(52)).toBe(VTF_FORMATS.DXT5);
      // Header (80) + DXT5 data (4 blocks * 16 bytes = 64)
      expect(vtf.length).toBe(80 + 64);
    });

    it('should create valid VTF with DXT5 and mipmaps', () => {
      const rgba = Buffer.alloc(8 * 8 * 4, 180);
      const vtf = convertRGBAToVTF(rgba, 8, 8, VTF_FORMATS.DXT5, true);

      expect(vtf.toString('ascii', 0, 3)).toBe('VTF');
      expect(vtf.readUInt32LE(52)).toBe(VTF_FORMATS.DXT5);
      expect(vtf[56]).toBe(4); // 4 mipmap levels: 8x8, 4x4, 2x2, 1x1

      // Calculate expected size:
      // 8x8: 4 blocks * 16 = 64 bytes
      // 4x4: 1 block * 16 = 16 bytes
      // 2x2: 1 block * 16 = 16 bytes
      // 1x1: 1 block * 16 = 16 bytes
      // Total: 112 bytes + 80 header = 192
      expect(vtf.length).toBe(80 + 64 + 16 + 16 + 16);
    });
  });

  describe('convertPNGBufferToVTF with DXT', () => {
    it('should convert PNG to DXT5 VTF', async () => {
      const pngBuffer = fs.readFileSync(TEST_PNG);
      const vtf = await convertPNGBufferToVTF(pngBuffer, {
        format: VTF_FORMATS.DXT5,
        width: 64,
        height: 64,
        generateMips: false
      });

      expect(vtf.toString('ascii', 0, 3)).toBe('VTF');
      expect(vtf.readUInt32LE(52)).toBe(VTF_FORMATS.DXT5);

      // 64x64 DXT5 = 256 blocks * 16 bytes = 4096 bytes + 80 header
      expect(vtf.length).toBe(80 + 4096);
    });

    it('should convert PNG to DXT1 VTF with mipmaps', async () => {
      const pngBuffer = fs.readFileSync(TEST_PNG);
      const vtf = await convertPNGBufferToVTF(pngBuffer, {
        format: VTF_FORMATS.DXT1,
        width: 64,
        height: 64,
        generateMips: true
      });

      expect(vtf.toString('ascii', 0, 3)).toBe('VTF');
      expect(vtf.readUInt32LE(52)).toBe(VTF_FORMATS.DXT1);
      expect(vtf[56]).toBe(7); // 7 mipmap levels for 64x64
    });
  });
});

// ============================================================================
// VTFEdit Reference Comparison Tests
// ============================================================================

describe('VTFEdit Reference Comparison', () => {
  /**
   * Helper to parse VTF header fields
   */
  function parseVTFHeader(buffer) {
    return {
      signature: buffer.toString('ascii', 0, 4),
      versionMajor: buffer.readUInt32LE(4),
      versionMinor: buffer.readUInt32LE(8),
      headerSize: buffer.readUInt32LE(12),
      width: buffer.readUInt16LE(16),
      height: buffer.readUInt16LE(18),
      flags: buffer.readUInt32LE(20),
      frames: buffer.readUInt16LE(24),
      firstFrame: buffer.readUInt16LE(26),
      reflectivityR: buffer.readFloatLE(32),
      reflectivityG: buffer.readFloatLE(36),
      reflectivityB: buffer.readFloatLE(40),
      bumpmapScale: buffer.readFloatLE(48),
      highResFormat: buffer.readUInt32LE(52),
      mipmapCount: buffer.readUInt8(56),
      lowResFormat: buffer.readUInt32LE(57),
      lowResWidth: buffer.readUInt8(61),
      lowResHeight: buffer.readUInt8(62)
    };
  }

  describe('BGRA8888 No Mipmaps', () => {
    let refVtf;
    let refHeader;

    beforeAll(() => {
      refVtf = fs.readFileSync(path.join(EXPECTED_DIR, 'bgra8888_nomip.vtf'));
      refHeader = parseVTFHeader(refVtf);
    });

    it('should match VTFEdit header structure', async () => {
      const pngBuffer = fs.readFileSync(TEST_PNG);
      const ourVtf = await convertPNGBufferToVTF(pngBuffer, {
        format: VTF_FORMATS.BGRA8888,
        generateMips: false,
        width: refHeader.width,
        height: refHeader.height
      });
      const ourHeader = parseVTFHeader(ourVtf);

      expect(ourHeader.signature).toBe('VTF\0');
      expect(ourHeader.width).toBe(refHeader.width);
      expect(ourHeader.height).toBe(refHeader.height);
      expect(ourHeader.highResFormat).toBe(VTF_FORMATS.BGRA8888);
      expect(ourHeader.mipmapCount).toBe(1);
    });

    it('should produce same dimensions as VTFEdit', async () => {
      const pngBuffer = fs.readFileSync(TEST_PNG);
      const ourVtf = await convertPNGBufferToVTF(pngBuffer, {
        format: VTF_FORMATS.BGRA8888,
        generateMips: false,
        width: refHeader.width,
        height: refHeader.height
      });
      const ourHeader = parseVTFHeader(ourVtf);

      expect(ourHeader.width).toBe(refHeader.width);
      expect(ourHeader.height).toBe(refHeader.height);
    });

    it('should have matching pixel data size for uncompressed format', async () => {
      const pngBuffer = fs.readFileSync(TEST_PNG);
      const ourVtf = await convertPNGBufferToVTF(pngBuffer, {
        format: VTF_FORMATS.BGRA8888,
        generateMips: false,
        width: refHeader.width,
        height: refHeader.height
      });

      const expectedPixelDataSize = refHeader.width * refHeader.height * 4; // BGRA = 4 bytes
      const ourPixelData = ourVtf.slice(80); // After 80-byte header

      expect(ourPixelData.length).toBe(expectedPixelDataSize);
    });
  });

  describe('RGB888 With Mipmaps', () => {
    let refVtf;
    let refHeader;

    beforeAll(() => {
      refVtf = fs.readFileSync(path.join(EXPECTED_DIR, 'rgb888_mip.vtf'));
      refHeader = parseVTFHeader(refVtf);
    });

    it('should match VTFEdit dimensions and format', async () => {
      const pngBuffer = fs.readFileSync(TEST_PNG);
      const ourVtf = await convertPNGBufferToVTF(pngBuffer, {
        format: VTF_FORMATS.RGB888,
        generateMips: true,
        width: refHeader.width,
        height: refHeader.height
      });
      const ourHeader = parseVTFHeader(ourVtf);

      expect(ourHeader.width).toBe(refHeader.width);
      expect(ourHeader.height).toBe(refHeader.height);
      expect(ourHeader.highResFormat).toBe(VTF_FORMATS.RGB888);
    });

    it('should have same mipmap count as VTFEdit', async () => {
      const pngBuffer = fs.readFileSync(TEST_PNG);
      const ourVtf = await convertPNGBufferToVTF(pngBuffer, {
        format: VTF_FORMATS.RGB888,
        generateMips: true,
        width: refHeader.width,
        height: refHeader.height
      });
      const ourHeader = parseVTFHeader(ourVtf);

      expect(ourHeader.mipmapCount).toBe(refHeader.mipmapCount);
    });

    it('should produce correct total data size with mipmaps', async () => {
      const pngBuffer = fs.readFileSync(TEST_PNG);
      const ourVtf = await convertPNGBufferToVTF(pngBuffer, {
        format: VTF_FORMATS.RGB888,
        generateMips: true,
        width: refHeader.width,
        height: refHeader.height
      });

      // Calculate expected mipmap chain size for RGB888 (3 bytes per pixel)
      let expectedSize = 0;
      let w = refHeader.width;
      let h = refHeader.height;
      for (let i = 0; i < refHeader.mipmapCount; i++) {
        expectedSize += w * h * 3;
        w = Math.max(1, Math.floor(w / 2));
        h = Math.max(1, Math.floor(h / 2));
      }

      const ourPixelData = ourVtf.slice(80);
      expect(ourPixelData.length).toBe(expectedSize);
    });
  });

  describe('DXT5 512x512 With Mipmaps (Header Only)', () => {
    let refVtf;
    let refHeader;

    beforeAll(() => {
      refVtf = fs.readFileSync(path.join(EXPECTED_DIR, 'dxt5_512x512_mip.vtf'));
      refHeader = parseVTFHeader(refVtf);
    });

    it('should parse VTFEdit DXT5 header correctly', () => {
      expect(refHeader.signature).toBe('VTF\0');
      expect(refHeader.width).toBe(512);
      expect(refHeader.height).toBe(512);
      expect(refHeader.highResFormat).toBe(VTF_FORMATS.DXT5);
    });

    it('should have expected mipmap count for 512x512', () => {
      // 512x512 = 10 mipmap levels (512, 256, 128, 64, 32, 16, 8, 4, 2, 1)
      expect(refHeader.mipmapCount).toBe(10);
    });

    it('should have valid VTF version', () => {
      expect(refHeader.versionMajor).toBe(7);
      expect(refHeader.versionMinor).toBeGreaterThanOrEqual(0);
    });

    it('should match our DXT5 output structure', async () => {
      const pngBuffer = fs.readFileSync(TEST_PNG);
      const ourVtf = await convertPNGBufferToVTF(pngBuffer, {
        format: VTF_FORMATS.DXT5,
        width: 512,
        height: 512,
        generateMips: true
      });
      const ourHeader = parseVTFHeader(ourVtf);

      expect(ourHeader.width).toBe(refHeader.width);
      expect(ourHeader.height).toBe(refHeader.height);
      expect(ourHeader.highResFormat).toBe(VTF_FORMATS.DXT5);
      expect(ourHeader.mipmapCount).toBe(refHeader.mipmapCount);
    });

    it('should produce same data size as VTFEdit for DXT5', async () => {
      const pngBuffer = fs.readFileSync(TEST_PNG);
      const ourVtf = await convertPNGBufferToVTF(pngBuffer, {
        format: VTF_FORMATS.DXT5,
        width: 512,
        height: 512,
        generateMips: true
      });

      // Calculate expected DXT5 mipmap chain size
      let expectedSize = 0;
      let w = 512, h = 512;
      for (let i = 0; i < 10; i++) {
        expectedSize += calculateDXTSize(w, h, VTF_FORMATS.DXT5);
        w = Math.max(1, Math.floor(w / 2));
        h = Math.max(1, Math.floor(h / 2));
      }

      const ourPixelData = ourVtf.slice(80);
      expect(ourPixelData.length).toBe(expectedSize);
    });
  });

  describe('Cross-format Header Consistency', () => {
    it('all reference VTFs should have valid VTF signature', () => {
      const files = ['bgra8888_nomip.vtf', 'rgb888_mip.vtf', 'dxt5_512x512_mip.vtf'];

      for (const file of files) {
        const vtf = fs.readFileSync(path.join(EXPECTED_DIR, file));
        const header = parseVTFHeader(vtf);

        expect(header.signature).toBe('VTF\0');
        expect(header.versionMajor).toBe(7);
        expect(header.width).toBeGreaterThan(0);
        expect(header.height).toBeGreaterThan(0);
      }
    });
  });
});
