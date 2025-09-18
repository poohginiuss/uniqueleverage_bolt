"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchVehicleData, Vehicle } from '@/lib/vehicle-data';
import { ArrowLeft } from '@untitledui/icons';

export default function PhotoGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const stockNumber = params.stockNumber as string;

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const vehicles = await fetchVehicleData();
        const foundVehicle = vehicles.find(v => v.stockNumber === stockNumber);
        setVehicle(foundVehicle || null);
      } catch (error) {
        console.error('Error loading vehicle:', error);
      } finally {
        setLoading(false);
      }
    };

    if (stockNumber) {
      loadVehicle();
    }
  }, [stockNumber]);

  const handleBackClick = () => {
    router.back();
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    const images = vehicle?.images || [];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    const images = vehicle?.images || [];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, vehicle?.images]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Vehicle Not Found</h1>
          <p className="text-gray-600 mb-4">The requested vehicle could not be found.</p>
        </div>
      </div>
    );
  }

  const images = vehicle.images || [];
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  // Helper function to create clickable image
  const createImageElement = (src: string, index: number, className: string = "w-full h-auto object-contain bg-gray-100 hover:opacity-90 transition-opacity cursor-pointer") => (
    <img
      src={src}
      alt={`${title} - Photo ${index + 1}`}
      className={className}
      onClick={() => openLightbox(index)}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = '<div class="flex items-center justify-center w-full h-32 bg-gray-100 text-gray-400 text-sm">Image not available</div>';
        }
      }}
    />
  );

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm">
        <div className="flex items-center pt-3 pl-5">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center justify-center w-10 h-10 text-black hover:text-gray-700 transition-all rounded-full hover:bg-gray-100"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Photo Grid - Responsive Container */}
      <div className="pt-16 h-full overflow-y-auto">
        <div className=" md:px-[calc((100vw-750px)/2)] md:py-2">
            {images.length > 0 ? (
              <div className="max-w-[750px] mx-auto space-y-2">
                {(() => {
                  const elements = [];
                  let i = 0;
                  
                  while (i < images.length) {
                    const cyclePosition = Math.floor(i / 6) % 1; // Reset every 6 images
                    const positionInCycle = i % 6;
                    
                    if (positionInCycle === 0) {
                      // Image 1: Full width
                      elements.push(
                        <div key={`full-${i}`} className="w-full">
                          {createImageElement(images[i], i)}
                        </div>
                      );
                      i++;
                    } else if (positionInCycle === 1) {
                      // Images 2-3: Half width side by side (or full width if no partner)
                      if (images[i + 1]) {
                        // Two images side by side
                        elements.push(
                          <div key={`pair-${i}`} className="flex gap-2">
                            <div className="w-1/2">
                              {createImageElement(images[i], i)}
                            </div>
                            <div className="w-1/2">
                              {createImageElement(images[i + 1], i + 1)}
                            </div>
                          </div>
                        );
                        i += 2; // Skip next image as it's included
                      } else {
                        // Single image, make it full width
                        elements.push(
                        <div key={`full-${i}`} className="w-full">
                          {createImageElement(images[i], i)}
                        </div>
                        );
                        i++;
                      }
                    } else if (positionInCycle === 3) {
                      // Image 4: Full width
                      elements.push(
                        <div key={`full-${i}`} className="w-full">
                          {createImageElement(images[i], i)}
                        </div>
                      );
                      i++;
                    } else if (positionInCycle === 4) {
                      // Images 5-6: Half width side by side (or full width if no partner)
                      if (images[i + 1]) {
                        // Two images side by side
                        elements.push(
                          <div key={`pair-${i}`} className="flex gap-2">
                            <div className="w-1/2">
                              {createImageElement(images[i], i)}
                            </div>
                            <div className="w-1/2">
                              {createImageElement(images[i + 1], i + 1)}
                            </div>
                          </div>
                        );
                        i += 2; // Skip next image as it's included
                      } else {
                        // Single image, make it full width
                        elements.push(
                        <div key={`full-${i}`} className="w-full">
                          {createImageElement(images[i], i)}
                        </div>
                        );
                        i++;
                      }
                    }
                  }
                  
                  return elements;
                })()}
              </div>
          ) : (
            <div className="text-center py-12 max-w-[750px] mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Photos Available</h3>
              <p className="text-gray-600">Photos for this vehicle are not currently available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
            </button>
          )}

          {/* Main Image */}
          <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <img
              src={images[currentImageIndex]}
              alt={`${title} - Photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="flex items-center justify-center text-white">Image not available</div>';
                }
              }}
            />
          </div>

          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={closeLightbox}
          />
        </div>
      )}
    </div>
  );
}
