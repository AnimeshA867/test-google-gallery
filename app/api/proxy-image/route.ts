import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get("url");
  const quality = parseInt(searchParams.get("quality") || "100");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 }
    );
  }

  // Validate quality parameter
  const validQuality = Math.min(Math.max(quality, 10), 100);

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

    // Process image with Sharp if quality is less than 100%
    if (validQuality < 100) {
      const sharpInstance = sharp(Buffer.from(imageBuffer));

      // Get image metadata to determine format
      const metadata = await sharpInstance.metadata();

      if (metadata.format === "jpeg" || metadata.format === "jpg") {
        processedImageBuffer = await sharpInstance
          .jpeg({ quality: validQuality, progressive: true })
          .toBuffer();
      } else if (metadata.format === "png") {
        processedImageBuffer = await sharpInstance
          .png({ quality: validQuality, progressive: true })
          .toBuffer();
      } else if (metadata.format === "webp") {
        processedImageBuffer = await sharpInstance
          .webp({ quality: validQuality })
          .toBuffer();
      } else {
        // For other formats, convert to JPEG with quality compression
        processedImageBuffer = await sharpInstance
          .jpeg({ quality: validQuality, progressive: true })
          .toBuffer();
      }
    } else {
      // Return original buffer for 100% quality
      processedImageBuffer = Buffer.from(imageBuffer);
    }

    // Return the image with proper CORS headers
    return new NextResponse(new Uint8Array(processedImageBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${
          validQuality < 100 ? 86400 : 31536000
        }`, // Shorter cache for compressed images
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "X-Image-Quality": validQuality.toString(),
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
