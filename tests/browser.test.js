import { describe, it, expect } from 'vitest';
import {
  convertRGBAToVTF,
  convertImageDataToVTF,
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
  calculateDXTSize,
  createBuffer,
  concatBuffers,
  CanvasToVTF,
  isBrowser,
  isNode
} from '../index.js';

// ============================================================================
// Environment Detection Tests
// ============================================================================

describe('Environment Detection', () => {
  it('should correctly detect Node.js environment', () => {
    // In Node.js test runner, isNode should be true
    expect(isNode).toBe(true);
    expect(isBrowser).toBe(false);
  });
});

// ============================================================================
// Cross-Platform Buffer Utilities Tests
// ============================================================================

describe('Cross-Platform Buffer Utilities', () => {
  describe('createBuffer', () => {
    it('should create a buffer of the specified size', () => {
      const buffer = createBuffer(100);
      expect(buffer.length).toBe(100);
    });

    it('should create a buffer initialized with zeros', () => {
      const buffer = createBuffer(10);
      for (let i = 0; i < buffer.length; i++) {
        expect(buffer[i]).toBe(0);
      }
    });

    it('should be writable', () => {
      const buffer = createBuffer(4);
      buffer[0] = 255;
      buffer[1] = 128;
      buffer[2] = 64;
      buffer[3] = 32;
      expect(buffer[0]).toBe(255);
      expect(buffer[1]).toBe(128);
      expect(buffer[2]).toBe(64);
      expect(buffer[3]).toBe(32);
    });
  });

  describe('concatBuffers', () => {
    it('should concatenate multiple buffers', () => {
      const buf1 = createBuffer(3);
      buf1[0] = 1; buf1[1] = 2; buf1[2] = 3;

      const buf2 = createBuffer(2);
      buf2[0] = 4; buf2[1] = 5;

      const result = concatBuffers([buf1, buf2]);
      expect(result.length).toBe(5);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(2);
      expect(result[2]).toBe(3);
      expect(result[3]).toBe(4);
      expect(result[4]).toBe(5);
    });

    it('should handle empty array', () => {
      const result = concatBuffers([]);
      expect(result.length).toBe(0);
    });

    it('should handle single buffer', () => {
      const buf = createBuffer(3);
      buf[0] = 10; buf[1] = 20; buf[2] = 30;

      const result = concatBuffers([buf]);
      expect(result.length).toBe(3);
      expect(result[0]).toBe(10);
      expect(result[1]).toBe(20);
      expect(result[2]).toBe(30);
    });

    it('should work with Uint8Array', () => {
      const buf1 = new Uint8Array([1, 2, 3]);
      const buf2 = new Uint8Array([4, 5]);

      const result = concatBuffers([buf1, buf2]);
      expect(result.length).toBe(5);
      expect(result[0]).toBe(1);
      expect(result[4]).toBe(5);
    });
  });
});

// ============================================================================
// Browser-Compatible Function Tests
// ============================================================================

describe('convertImageDataToVTF', () => {
  it('should convert ImageData-like object to VTF', () => {
    // Create a fake ImageData object (2x2 red image)
    const imageData = {
      data: new Uint8ClampedArray([
        255, 0, 0, 255,  // Red pixel
        255, 0, 0, 255,  // Red pixel
        255, 0, 0, 255,  // Red pixel
        255, 0, 0, 255   // Red pixel
      ]),
      width: 2,
      height: 2
    };

    const vtfData = convertImageDataToVTF(imageData);

    // Should have VTF signature
    expect(vtfData[0]).toBe(0x56); // 'V'
    expect(vtfData[1]).toBe(0x54); // 'T'
    expect(vtfData[2]).toBe(0x46); // 'F'
    expect(vtfData[3]).toBe(0x00); // null
  });

  it('should support custom format option', () => {
    const imageData = {
      data: new Uint8ClampedArray([
        255, 0, 0, 255,
        0, 255, 0, 255,
        0, 0, 255, 255,
        255, 255, 255, 255
      ]),
      width: 2,
      height: 2
    };

    const vtfData = convertImageDataToVTF(imageData, {
      format: VTF_FORMATS.BGR888
    });

    // Check format in header (offset 52)
    const format = vtfData[52] | (vtfData[53] << 8) | (vtfData[54] << 16) | (vtfData[55] << 24);
    expect(format).toBe(VTF_FORMATS.BGR888);
  });

  it('should support disabling mipmaps', () => {
    const imageData = {
      data: new Uint8ClampedArray(4 * 4 * 4), // 4x4 image
      width: 4,
      height: 4
    };

    const vtfWithMips = convertImageDataToVTF(imageData, { generateMips: true });
    const vtfNoMips = convertImageDataToVTF(imageData, { generateMips: false });

    // Mipmap count is at offset 56
    expect(vtfWithMips[56]).toBe(3); // 4x4 -> 2x2 -> 1x1 = 3 levels
    expect(vtfNoMips[56]).toBe(1);   // No mipmaps = 1 level

    // File with mipmaps should be larger
    expect(vtfWithMips.length).toBeGreaterThan(vtfNoMips.length);
  });
});

describe('CanvasToVTF Class', () => {
  it('should create instance with default options', () => {
    const converter = new CanvasToVTF();
    expect(converter.format).toBe(VTF_FORMATS.RGBA8888);
    expect(converter.mipmaps).toBe(true);
  });

  it('should create instance with custom options', () => {
    const converter = new CanvasToVTF({
      format: VTF_FORMATS.BGR888,
      mipmaps: false,
      flags: VTF_FLAGS.TRILINEAR
    });
    expect(converter.format).toBe(VTF_FORMATS.BGR888);
    expect(converter.mipmaps).toBe(false);
    expect(converter.flags).toBe(VTF_FLAGS.TRILINEAR);
  });

  it('should convert ImageData via convertImageData method', () => {
    const converter = new CanvasToVTF({ format: VTF_FORMATS.RGBA8888 });

    const imageData = {
      data: new Uint8ClampedArray([
        255, 0, 0, 255,
        0, 255, 0, 255,
        0, 0, 255, 255,
        255, 255, 255, 128
      ]),
      width: 2,
      height: 2
    };

    const vtfData = converter.convertImageData(imageData);

    // Should have valid VTF header
    expect(vtfData[0]).toBe(0x56); // 'V'
    expect(vtfData[1]).toBe(0x54); // 'T'
    expect(vtfData[2]).toBe(0x46); // 'F'
  });
});

// ============================================================================
// convertRGBAToVTF with Uint8Array Input Tests
// ============================================================================

describe('convertRGBAToVTF with Uint8Array', () => {
  it('should accept Uint8Array as input (browser compatibility)', () => {
    const rgbaData = new Uint8Array([
      255, 0, 0, 255,  // Red
      0, 255, 0, 255,  // Green
      0, 0, 255, 255,  // Blue
      255, 255, 0, 255 // Yellow
    ]);

    const vtfData = convertRGBAToVTF(rgbaData, 2, 2, VTF_FORMATS.RGBA8888, false);

    // Should have VTF signature
    expect(vtfData[0]).toBe(0x56);
    expect(vtfData[1]).toBe(0x54);
    expect(vtfData[2]).toBe(0x46);

    // Header is 80 bytes, pixel data is 16 bytes (2x2x4)
    expect(vtfData.length).toBe(80 + 16);
  });

  it('should work with DXT compression using Uint8Array', () => {
    // 4x4 image for DXT block
    const rgbaData = new Uint8Array(4 * 4 * 4);
    for (let i = 0; i < rgbaData.length; i += 4) {
      rgbaData[i] = 255;     // R
      rgbaData[i + 1] = 0;   // G
      rgbaData[i + 2] = 0;   // B
      rgbaData[i + 3] = 255; // A
    }

    const vtfData = convertRGBAToVTF(rgbaData, 4, 4, VTF_FORMATS.DXT5, false);

    // Should have VTF signature
    expect(vtfData[0]).toBe(0x56);
    expect(vtfData[1]).toBe(0x54);
    expect(vtfData[2]).toBe(0x46);

    // DXT5 for 4x4 = 16 bytes
    expect(vtfData.length).toBe(80 + 16);
  });
});

// ============================================================================
// Format Conversion with Uint8Array Tests
// ============================================================================

describe('Format Conversion with Uint8Array', () => {
  it('should convert Uint8Array RGBA to BGRA8888', () => {
    const input = new Uint8Array([
      255, 0, 0, 255,  // RGBA Red
      0, 255, 0, 128   // RGBA Green
    ]);

    const output = convertToFormat(input, VTF_FORMATS.BGRA8888);

    // First pixel: R=255, G=0, B=0, A=255 -> B=0, G=0, R=255, A=255
    expect(output[0]).toBe(0);   // B
    expect(output[1]).toBe(0);   // G
    expect(output[2]).toBe(255); // R
    expect(output[3]).toBe(255); // A

    // Second pixel: R=0, G=255, B=0, A=128 -> B=0, G=255, R=0, A=128
    expect(output[4]).toBe(0);   // B
    expect(output[5]).toBe(255); // G
    expect(output[6]).toBe(0);   // R
    expect(output[7]).toBe(128); // A
  });

  it('should convert Uint8Array RGBA to RGB888', () => {
    const input = new Uint8Array([
      100, 150, 200, 255,  // RGBA
      50, 75, 100, 128     // RGBA (alpha should be stripped)
    ]);

    const output = convertToFormat(input, VTF_FORMATS.RGB888);

    expect(output.length).toBe(6); // 2 pixels * 3 bytes
    expect(output[0]).toBe(100); // R
    expect(output[1]).toBe(150); // G
    expect(output[2]).toBe(200); // B
    expect(output[3]).toBe(50);  // R
    expect(output[4]).toBe(75);  // G
    expect(output[5]).toBe(100); // B
  });
});

// ============================================================================
// Mipmap Generation with Uint8Array Tests
// ============================================================================

describe('Mipmap Generation with Uint8Array', () => {
  it('should generate mipmaps from Uint8Array', () => {
    // 4x4 solid red image
    const rgbaData = new Uint8Array(4 * 4 * 4);
    for (let i = 0; i < rgbaData.length; i += 4) {
      rgbaData[i] = 255;     // R
      rgbaData[i + 1] = 0;   // G
      rgbaData[i + 2] = 0;   // B
      rgbaData[i + 3] = 255; // A
    }

    const mipmaps = generateMipmaps(rgbaData, 4, 4);

    // Should have 3 levels: 4x4, 2x2, 1x1
    expect(mipmaps.length).toBe(3);

    // Smallest first (VTF order)
    expect(mipmaps[0].length).toBe(1 * 1 * 4); // 1x1
    expect(mipmaps[1].length).toBe(2 * 2 * 4); // 2x2
    expect(mipmaps[2].length).toBe(4 * 4 * 4); // 4x4

    // All mipmaps should be red
    for (const mipmap of mipmaps) {
      for (let i = 0; i < mipmap.length; i += 4) {
        expect(mipmap[i]).toBe(255);     // R
        expect(mipmap[i + 1]).toBe(0);   // G
        expect(mipmap[i + 2]).toBe(0);   // B
        expect(mipmap[i + 3]).toBe(255); // A
      }
    }
  });
});

// ============================================================================
// DXT Compression with Uint8Array Tests
// ============================================================================

describe('DXT Compression with Uint8Array', () => {
  it('should compress Uint8Array to DXT1', () => {
    const rgbaData = new Uint8Array(4 * 4 * 4);
    for (let i = 0; i < rgbaData.length; i += 4) {
      rgbaData[i] = 255;
      rgbaData[i + 1] = 128;
      rgbaData[i + 2] = 64;
      rgbaData[i + 3] = 255;
    }

    const compressed = compressToDXT(rgbaData, 4, 4, VTF_FORMATS.DXT1);

    // DXT1: 4x4 block = 8 bytes
    expect(compressed.length).toBe(8);
  });

  it('should compress Uint8Array to DXT5', () => {
    const rgbaData = new Uint8Array(4 * 4 * 4);
    for (let i = 0; i < rgbaData.length; i += 4) {
      rgbaData[i] = 255;
      rgbaData[i + 1] = 128;
      rgbaData[i + 2] = 64;
      rgbaData[i + 3] = 200;
    }

    const compressed = compressToDXT(rgbaData, 4, 4, VTF_FORMATS.DXT5);

    // DXT5: 4x4 block = 16 bytes
    expect(compressed.length).toBe(16);
  });
});

// ============================================================================
// VTF Header with createBuffer Tests
// ============================================================================

describe('VTF Header Creation', () => {
  it('should create valid header with createBuffer', () => {
    const header = createVTFHeader(256, 128, VTF_FORMATS.RGBA8888);

    expect(header.length).toBe(80);

    // Signature
    expect(header[0]).toBe(0x56);
    expect(header[1]).toBe(0x54);
    expect(header[2]).toBe(0x46);

    // Version 7.2
    expect(header[4]).toBe(7);
    expect(header[8]).toBe(2);

    // Dimensions (little-endian)
    expect(header[16] | (header[17] << 8)).toBe(256);
    expect(header[18] | (header[19] << 8)).toBe(128);
  });
});
