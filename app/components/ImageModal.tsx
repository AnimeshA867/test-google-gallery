"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Calendar,
  HardDrive,
  FileType,
  ExternalLink,
} from "lucide-react";
import { DriveImage } from "../api/images/route";
import { useEffect, useState } from "react";
import { getFullSizeImageUrl } from "../lib/image-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ImageModalProps {
  image: DriveImage | null;
  onClose: () => void;
}

export function ImageModal({ image, onClose }: ImageModalProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (image) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      // Reset loading state when new image opens
      setImageLoading(true);
      setImageError(false);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [image, onClose]);

  if (!image) return null;

  // Use full size URL with 100% quality for modal view
  const fullSizeUrl = getFullSizeImageUrl(image);

  const formatFileSize = (bytes: string | null | undefined) => {
    if (!bytes) return "Unknown";
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${Math.round(size / (1024 * 1024))} MB`;
  };

  const handleDownload = () => {
    if (image.webContentLink) {
      window.open(image.webContentLink, "_blank");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative max-w-[95vw] max-h-[95vh] flex flex-col bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with controls */}
          <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                <FileType className="w-3 h-3 mr-1" />
                {image.mimeType.split("/")[1].toUpperCase()}
              </Badge>
              <h2 className="font-semibold text-white text-lg truncate max-w-xs md:max-w-md">
                {image.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {image.webContentLink && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="text-white hover:bg-white/20 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Image container */}
          <div className="relative flex-1 flex items-center justify-center min-h-0 p-4">
            {fullSizeUrl ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative max-w-full max-h-full"
              >
                {/* Loading overlay */}
                {imageLoading && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-3 text-white">
                      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <p className="text-sm">Loading full resolution...</p>
                    </div>
                  </div>
                )}

                <Image
                  src={fullSizeUrl}
                  alt={image.name}
                  width={1200}
                  height={800}
                  className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  unoptimized
                  priority
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                  }}
                />
              </motion.div>
            ) : imageError ? (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <div className="text-white/70">
                    <FileType className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg">Failed to load image</p>
                    <p className="text-sm opacity-70 mt-2">
                      Try downloading the original file or check your connection
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <div className="text-white/70">
                    <FileType className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg">Image not available for full view</p>
                    <p className="text-sm opacity-70 mt-2">
                      Try downloading the original file
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer with image info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/50 backdrop-blur-sm p-4 text-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-white/70">Created:</span>
                <span>{new Date(image.createdTime).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-green-400" />
                <span className="text-white/70">Size:</span>
                <span>{formatFileSize(image.size)}</span>
              </div>

              <div className="flex items-center gap-2">
                <FileType className="w-4 h-4 text-purple-400" />
                <span className="text-white/70">Type:</span>
                <span>{image.mimeType}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
