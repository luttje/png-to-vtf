/**
 * PNG to VTF (Valve Texture Format) Converter for Node.js
 *
 * Converts PNG images to VTF format files for use in Source engine games.
 *
 * VTF Specification:
 * https://developer.valvesoftware.com/wiki/VTF_(Valve_Texture_Format)
 *
 * This implementation uses VTF version 7.1 with 64-byte headers.
 */

const fs = require('fs');
const sharp = require('sharp');

// ============================================================================
// VTF Format Constants
// ============================================================================

/**
 * VTF Image Formats
 * These correspond to the IMAGE_FORMAT enum in the VTF specification
 */
const VTF_FORMATS = {
    RGBA8888: 0,      // 32-bit RGBA (8 bits per channel)
    RGB888: 2,        // 24-bit RGB (8 bits per channel, no alpha)
    RGB565: 4,        // 16-bit RGB (5-6-5 bits per channel)
    DXT1: 13,         // DXT1 block compression (requires external library)
    DXT5: 15,         // DXT5 block compression with alpha (requires external library)
    BGRA5551: 21,     // 16-bit BGRA (5-5-5-1 bits per channel)
    BGRA4444: 19      // 16-bit BGRA (4 bits per channel)
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Write a 16-bit short value to a byte array
 */
function writeShort(data, pos, value) {
    data[pos] = value & 0xFF;
    data[pos + 1] = (value >>> 8) & 0xFF;
}

/**
 * Write a multi-byte integer to a byte array
 */
function writeInt(data, pos, value, bytes) {
    for (let i = 0; i < bytes; i++) {
        data[pos + i] = (value >>> (i * 8)) & 0xFF;
    }
}

// ============================================================================
// Image Format Conversion Functions
// ============================================================================

/**
 * Convert RGBA8888 to RGB888
 * Strips the alpha channel from 32-bit RGBA data
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
 * Convert RGBA8888 to RGB565
 * Reduces color depth to 16-bit: 5 bits red, 6 bits green, 5 bits blue
 */
function convertRGBA8888ToRGB565(data) {
    const output = Buffer.alloc((data.length / 4) * 2);

    for (let i = 0, j = 0; i < data.length; i += 4, j += 2) {
        const r = data[i] >> 3;       // 5 bits
        const g = data[i + 1] >> 2;   // 6 bits
        const b = data[i + 2] >> 3;   // 5 bits

        const rgb565 = (r) + (g << 5) + (b << 11);
        writeShort(output, j, rgb565);
    }

    return output;
}

/**
 * Convert RGBA8888 to BGRA5551
 * Reduces to 16-bit: 5 bits each for RGB, 1 bit for alpha (on/off transparency)
 */
function convertRGBA8888ToBGRA5551(data) {
    const output = Buffer.alloc((data.length / 4) * 2);

    for (let i = 0, j = 0; i < data.length; i += 4, j += 2) {
        const r = data[i] >> 3;       // 5 bits
        const g = data[i + 1] >> 3;   // 5 bits
        const b = data[i + 2] >> 3;   // 5 bits
        const a = data[i + 3] >> 7;   // 1 bit

        const bgra5551 = (r << 10) + (g << 5) + b + (a << 15);
        writeShort(output, j, bgra5551);
    }

    return output;
}

/**
 * Convert RGBA8888 to BGRA4444
 * Reduces to 16-bit: 4 bits per channel for BGRA
 */
function convertRGBA8888ToBGRA4444(data) {
    const output = Buffer.alloc((data.length / 4) * 2);

    for (let i = 0, j = 0; i < data.length; i += 4, j += 2) {
        const r = data[i] >> 4;       // 4 bits
        const g = data[i + 1] >> 4;   // 4 bits
        const b = data[i + 2] >> 4;   // 4 bits
        const a = data[i + 3] >> 4;   // 4 bits

        const bgra4444 = (r << 8) + (g << 4) + b + (a << 12);
        writeShort(output, j, bgra4444);
    }

    return output;
}

// ============================================================================
// VTF Header Creation
// ============================================================================

/**
 * Create VTF header according to VTF 7.1 specification
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} format - VTF format constant
 * @param {boolean} mipmaps - Whether mipmaps are included
 * @returns {Buffer} VTF header (64 bytes)
 */
function createVTFHeader(width, height, format, mipmaps = false) {
    const header = Buffer.alloc(64);

    // Signature: "VTF\0" (4 bytes)
    header[0] = 86;  // 'V'
    header[1] = 84;  // 'T'
    header[2] = 70;  // 'F'
    header[3] = 0;

    // Version: 7.1 (8 bytes total: two unsigned ints)
    header[4] = 7;   // Major version
    header[5] = 0;
    header[6] = 0;
    header[7] = 0;
    header[8] = 1;   // Minor version
    header[9] = 0;
    header[10] = 0;
    header[11] = 0;

    // Header size in bytes (unsigned int)
    header[12] = 64;
    header[13] = 0;
    header[14] = 0;
    header[15] = 0;

    // Width and height (unsigned shorts)
    writeShort(header, 16, width);
    writeShort(header, 18, height);

    // Flags (unsigned int)
    // VTF Flags reference: https://developer.valvesoftware.com/wiki/VTF_(Valve_Texture_Format)#Image_flags
    // 0x2000 = TEXTUREFLAGS_EIGHTBITALPHA (Eight Bit Alpha)
    // We only use Eight Bit Alpha flag to match working textures
    const flags = 0x2000; // Eight Bit Alpha only
    writeInt(header, 20, flags, 4);

    // Number of frames (unsigned short) - 1 for static image
    writeShort(header, 24, 1);

    // First frame index (unsigned short)
    writeShort(header, 26, 0);

    // Reflectivity padding (4 bytes)
    header[28] = 0;
    header[29] = 0;
    header[30] = 0;
    header[31] = 0;

    // Reflectivity vector (3 floats = 12 bytes)
    for (let i = 32; i < 44; i++) {
        header[i] = 0;
    }

    // Reflectivity padding (4 bytes)
    header[44] = 0;
    header[45] = 0;
    header[46] = 0;
    header[47] = 0;

    // Bumpmap scale (float)
    header[48] = 0;
    header[49] = 0;
    header[50] = 0;
    header[51] = 0;

    // High resolution image format (int) - the actual texture data format
    writeInt(header, 52, format, 4);

    // Mipmap count (unsigned char)
    header[56] = mipmaps ? calculateMipmapCount(width, height) : 1;

    // Low resolution image format (int) - always DXT1 for thumbnails
    writeInt(header, 57, 13, 4);

    // Low resolution image dimensions (unsigned chars)
    // Set to 0 to indicate no low-res thumbnail data
    header[61] = 0;
    header[62] = 0;

    // Depth (unsigned short) - always 1 for 2D textures
    header[63] = 1;

    return header;
}

/**
 * Calculate number of mipmap levels needed
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
 * @param {Buffer[]} mipmaps - Array of RGBA mipmap buffers
 * @param {number} format - Target VTF format
 * @returns {Buffer[]} Converted mipmap buffers
 */
function convertMipmapsToFormat(mipmaps, format) {
    return mipmaps.map(mipmap => {
        switch (format) {
            case VTF_FORMATS.RGBA8888:
                return mipmap;
            case VTF_FORMATS.RGB888:
                return convertRGBA8888ToRGB888(mipmap);
            case VTF_FORMATS.RGB565:
                return convertRGBA8888ToRGB565(mipmap);
            case VTF_FORMATS.BGRA5551:
                return convertRGBA8888ToBGRA5551(mipmap);
            case VTF_FORMATS.BGRA4444:
                return convertRGBA8888ToBGRA4444(mipmap);
            default:
                return mipmap;
        }
    });
}

// ============================================================================
// Main Conversion Functions
// ============================================================================

/**
 * Convert raw RGBA pixel data to VTF format
 * @param {Buffer} rgbaData - Raw RGBA pixel data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} format - VTF format constant (default: RGBA8888)
 * @param {boolean} generateMips - Whether to generate mipmaps (default: true)
 * @returns {Buffer} VTF file data
 */
function convertRGBAToVTF(rgbaData, width, height, format = VTF_FORMATS.RGBA8888, generateMips = true) {
    if (format === VTF_FORMATS.DXT1 || format === VTF_FORMATS.DXT5) {
        throw new Error('DXT compression requires additional libraries. Use RGBA8888 or other formats.');
    }

    let pixelDataBuffers;

    if (generateMips) {
        // Generate mipmap chain
        const mipmaps = generateMipmaps(rgbaData, width, height);
        // Convert each mipmap to target format
        pixelDataBuffers = convertMipmapsToFormat(mipmaps, format);
    } else {
        // Single level, no mipmaps
        let pixelData;
        switch (format) {
            case VTF_FORMATS.RGBA8888:
                pixelData = rgbaData;
                break;
            case VTF_FORMATS.RGB888:
                pixelData = convertRGBA8888ToRGB888(rgbaData);
                break;
            case VTF_FORMATS.RGB565:
                pixelData = convertRGBA8888ToRGB565(rgbaData);
                break;
            case VTF_FORMATS.BGRA5551:
                pixelData = convertRGBA8888ToBGRA5551(rgbaData);
                break;
            case VTF_FORMATS.BGRA4444:
                pixelData = convertRGBA8888ToBGRA4444(rgbaData);
                break;
            default:
                pixelData = rgbaData;
        }
        pixelDataBuffers = [pixelData];
    }

    // Create header and combine with pixel data
    const header = createVTFHeader(width, height, format, generateMips);
    return Buffer.concat([header, ...pixelDataBuffers]);
}

/**
 * Convert a PNG file to VTF format
 * @param {string} inputPath - Path to input PNG file
 * @param {string} outputPath - Path to output VTF file
 * @param {Object} options - Conversion options
 * @param {number} options.format - VTF format (default: RGBA8888)
 * @param {number} options.width - Resize width (optional, must be power of 2)
 * @param {number} options.height - Resize height (optional, must be power of 2)
 * @returns {Promise<{width: number, height: number, format: number}>} Conversion result info
 */
async function convertPNGToVTF(inputPath, outputPath, options = {}) {
    const format = options.format !== undefined ? options.format : VTF_FORMATS.RGBA8888;

    // Load the image with sharp
    let image = sharp(inputPath);
    const metadata = await image.metadata();

    let width = options.width || metadata.width;
    let height = options.height || metadata.height;

    // Resize if dimensions were specified
    if (options.width || options.height) {
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
    const vtfData = convertRGBAToVTF(data, width, height, format);

    // Write to file
    fs.writeFileSync(outputPath, vtfData);

    return { width, height, format };
}

/**
 * Convert a PNG buffer to VTF format
 * @param {Buffer} pngBuffer - PNG image buffer
 * @param {Object} options - Conversion options
 * @param {number} options.format - VTF format (default: RGBA8888)
 * @param {number} options.width - Resize width (optional)
 * @param {number} options.height - Resize height (optional)
 * @returns {Promise<Buffer>} VTF file buffer
 */
async function convertPNGBufferToVTF(pngBuffer, options = {}) {
    const format = options.format !== undefined ? options.format : VTF_FORMATS.RGBA8888;

    // Load the image with sharp
    let image = sharp(pngBuffer);
    const metadata = await image.metadata();

    let width = options.width || metadata.width;
    let height = options.height || metadata.height;

    // Resize if dimensions were specified
    if (options.width || options.height) {
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
    return convertRGBAToVTF(data, width, height, format);
}

// ============================================================================
// Exports
// ============================================================================

module.exports = {
    VTF_FORMATS,
    convertPNGToVTF,
    convertPNGBufferToVTF,
    convertRGBAToVTF,
    createVTFHeader
};
