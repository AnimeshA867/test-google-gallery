import { google } from "googleapis";
import { NextResponse } from "next/server";

const drive = google.drive({
  version: "v3",
  auth: process.env.GOOGLE_DRIVE_API_KEY,
});

export interface DriveImage {
  id: string;
  name: string;
  thumbnailLink?: string | null;
  webViewLink?: string | null;
  webContentLink?: string | null;
  directLink?: string;
  mimeType: string;
  size?: string | null;
  createdTime: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalImages: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Helper function to convert Google Drive links to direct access links
function getDirectImageUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSizeParam = parseInt(searchParams.get("pageSize") || "12");

    // Validate and constrain page size
    const pageSize = Math.min(Math.max(pageSizeParam, 6), 48); // Min 6, Max 48

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
      return NextResponse.json(
        { error: "Google Drive folder ID not configured" },
        { status: 500 }
      );
    }

    // Get total count of images by fetching all
    let totalImages = 0;
    let countNextPageToken: string | undefined;

    do {
      const countResponse = await drive.files.list({
        q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed=false`,
        fields: "nextPageToken,files(id)",
        pageSize: 1000,
        pageToken: countNextPageToken,
      });

      totalImages += countResponse.data.files?.length || 0;
      countNextPageToken = countResponse.data.nextPageToken || undefined;
    } while (countNextPageToken);

    const totalPages = Math.ceil(totalImages / pageSize);

    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;

    // Get all images with proper pagination handling
    let allImages: any[] = [];
    let nextPageToken: string | undefined;

    // Fetch all images by handling pagination
    do {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed=false`,
        fields:
          "nextPageToken,files(id,name,thumbnailLink,webViewLink,webContentLink,mimeType,size,createdTime)",
        orderBy: "createdTime desc",
        pageSize: 1000, // Max per request
        pageToken: nextPageToken,
      });

      if (response.data.files) {
        allImages = allImages.concat(response.data.files);
      }

      nextPageToken = response.data.nextPageToken || undefined;
    } while (nextPageToken);

    const paginatedFiles = allImages.slice(offset, offset + pageSize);

    const images: DriveImage[] = paginatedFiles.map((file) => ({
      id: file.id!,
      name: file.name!,
      thumbnailLink: file.thumbnailLink,
      webViewLink: file.webViewLink,
      webContentLink: file.webContentLink,
      directLink: getDirectImageUrl(file.id!),
      mimeType: file.mimeType!,
      size: file.size,
      createdTime: file.createdTime!,
    }));

    const pagination: PaginationInfo = {
      currentPage: page,
      totalPages,
      totalImages,
      pageSize,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return NextResponse.json(
      { images, pagination },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching images from Google Drive:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
