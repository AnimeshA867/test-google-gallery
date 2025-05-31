import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get("url");
  const quality = parseInt(searchParams.get("quality") || "100");
  const maxWidth = parseInt(searchParams.get("maxWidth") || "0");
  const maxHeight = parseInt(searchParams.get("maxHeight") || "0");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 }
    );
  }

  // Validate quality parameter
  const validQuality = Math.min(Math.max(quality, 10), 100);
  const isCompress = validQuality < 100 || maxWidth > 0 || maxHeight > 0;

  try {
    // Fetch the image from Google Drive
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Gallery Bot)",
      },
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: imageResponse.status }
      );
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";

    let processedImageBuffer: Buffer;

    // Process image with Sharp if compression or resizing is needed
    if (isCompress) {
      const sharpInstance = sharp(Buffer.from(imageBuffer));

      // Resize if dimensions are specified
      if (maxWidth > 0 || maxHeight > 0) {
        sharpInstance.resize({
          width: maxWidth > 0 ? maxWidth : undefined,
          height: maxHeight > 0 ? maxHeight : undefined,
          fit: 'inside', // Maintain aspect ratio
          withoutEnlargement: true, // Don't upscale smaller images
        });
      }

      // Get image metadata to determine format
      const metadata = await sharpInstance.metadata();

      if (metadata.format === "jpeg" || metadata.format === "jpg") {
        processedImageBuffer = await sharpInstance
          .jpeg({ 
            quality: validQuality, 
            progressive: true, 
            mozjpeg: true,
            optimizeScans: true,
            optimizeCoding: true
          })
          .toBuffer();
      } else if (metadata.format === "png") {
        // For very low quality, convert PNG to JPEG for better compression
        if (validQuality < 30) {
          processedImageBuffer = await sharpInstance
            .jpeg({ 
              quality: validQuality, 
              progressive: true, 
              mozjpeg: true,
              optimizeScans: true,
              optimizeCoding: true
            })
            .toBuffer();
        } else {
          processedImageBuffer = await sharpInstance
            .png({ quality: validQuality, progressive: true, compressionLevel: 9, effort: 10 })
            .toBuffer();
        }
      } else if (metadata.format === "webp") {
        processedImageBuffer = await sharpInstance
          .webp({ quality: validQuality, effort: 6, smartSubsample: true, nearLossless: false })
          .toBuffer();
      } else {
        // For other formats, convert to JPEG with quality compression
        processedImageBuffer = await sharpInstance
          .jpeg({ 
            quality: validQuality, 
            progressive: true, 
            mozjpeg: true,
            optimizeScans: true,
            optimizeCoding: true
          })
          .toBuffer();
      }
    } else {
      // Return original buffer for 100% quality with no resizing
      processedImageBuffer = Buffer.from(imageBuffer);
    }

    // Return the image with proper CORS headers
    return new NextResponse(new Uint8Array(processedImageBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${
          isCompress ? 86400 : 31536000
        }`, // Shorter cache for compressed images
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "X-Image-Quality": validQuality.toString(),
        "X-File-Size": processedImageBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error proxying image:", error);
    return NextResponse.json(
      { error: "Failed to proxy image" },
      { status: 500 }
    );
  }
}
