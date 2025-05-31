import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Eye } from "lucide-react";
import { DriveImage } from "../api/images/route";
import { useState } from "react";
import { getThumbnailImageUrl } from "../lib/image-utils";

interface ImageCardProps {
  image: DriveImage;
  onClick: () => void;
  layoutMode: "grid" | "masonry";
}

export function ImageCard({ image, onClick, layoutMode }: ImageCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const imageUrl = getThumbnailImageUrl(image);

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "IMG";
  };

  const formatFileSize = (bytes: string | null | undefined) => {
    if (!bytes) return "Unknown size";
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1048576) return `${Math.round(size / 1024)} KB`;
    return `${Math.round(size / 1048576)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="h-fit"
    >
      <Card className="group cursor-pointer overflow-hidden border-0 bg-white/70 backdrop-blur-md dark:bg-gray-900/70 shadow-lg hover:shadow-2xl transition-all duration-300">
        <div
          className={`relative ${
            layoutMode === "grid" ? "aspect-square" : "aspect-[4/5]"
          } overflow-hidden`}
        >
          {imageUrl && !imageError ? (
            <>
              {/* Loading skeleton */}
              {imageLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              )}

              <Image
                src={imageUrl}
                alt={image.name}
                fill
                className={`object-cover transition-all duration-300 group-hover:scale-110 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                unoptimized
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClick}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.button>
                  {image.webContentLink && (
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      href={image.webContentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </motion.a>
                  )}
                </div>
              </div>

              {/* File type badge */}
              <Badge className="absolute top-3 left-3 bg-black/50 text-white border-0">
                {getFileExtension(image.name)}
              </Badge>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {imageError ? "Failed to load" : "No preview"}
                </p>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3
            className="font-semibold text-sm mb-2 truncate text-gray-900 dark:text-white"
            title={image.name}
          >
            {image.name}
          </h3>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(image.createdTime).toLocaleDateString()}</span>
            </div>
            <span className="font-medium">{formatFileSize(image.size)}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
