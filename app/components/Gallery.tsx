"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useImages } from "../hooks/useImages";
import { ImageCard } from "./ImageCard";
import { ImageModal } from "./ImageModal";
import { GalleryPagination } from "./GalleryPagination";
import { GalleryControls, LayoutType } from "./GalleryControls";
import { MasonryLayout } from "./MasonryLayout";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { DriveImage } from "../api/images/route";
import { Button } from "@/components/ui/button";

export function Gallery() {
  const {
    images,
    pagination,
    loading,
    error,
    currentPage,
    currentPageSize,
    fetchImages,
    setPageSize,
  } = useImages();
  const [selectedImage, setSelectedImage] = useState<DriveImage | null>(null);
  const [layout, setLayout] = useState<LayoutType>("grid");

  const handlePageChange = async (page: number) => {
    setSelectedImage(null); // Close modal if open
    await fetchImages(page, currentPageSize);
  };

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
  };

  const handlePageSizeChange = async (size: number) => {
    setSelectedImage(null); // Close modal if open
    await setPageSize(size);
  };

  if (loading && !pagination) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50"
        >
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button
            onClick={() => fetchImages(1, currentPageSize)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  if (images.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50"
        >
          <h2 className="text-2xl font-bold mb-4">No Images Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            No images were found in the configured Google Drive folder.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Photo Gallery
            </h1>
            {pagination && (
              <p className="text-gray-600 dark:text-gray-400">
                {pagination.totalImages} image
                {pagination.totalImages !== 1 ? "s" : ""} from Google Drive
              </p>
            )}
          </motion.header>

          {/* Gallery Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GalleryControls
              layout={layout}
              onLayoutChange={handleLayoutChange}
              pageSize={currentPageSize}
              onPageSizeChange={handlePageSizeChange}
              totalImages={pagination?.totalImages}
              loading={loading}
            />
          </motion.div>

          {/* Loading overlay for page changes */}
          {loading && pagination && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200/50 dark:border-gray-700/50">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span>Loading images...</span>
              </div>
            </motion.div>
          )}

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0.5 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {layout === "masonry" ? (
              <MasonryLayout gap={16} minItemWidth={240} className="mb-8">
                {images.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onClick={() => setSelectedImage(image)}
                    layoutMode={layout}
                  />
                ))}
              </MasonryLayout>
            ) : (
              <div className="grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5  gap-4 mb-8">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <ImageCard
                      image={image}
                      onClick={() => setSelectedImage(image)}
                      layoutMode={layout}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GalleryPagination
                pagination={pagination}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </motion.div>
          )}
        </div>
      </div>

      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
