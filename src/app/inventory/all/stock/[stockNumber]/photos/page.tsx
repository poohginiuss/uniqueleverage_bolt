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

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm">
        <div className="flex items-center p-4">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
          </button>
        </div>
      </div>

      {/* Photo Grid - Responsive Container */}
      <div className="pt-16 h-full overflow-y-auto">
        <div className="p-2 md:px-[calc((100vw-750px)/2)] md:py-2">
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
                          <img
                            src={images[i]}
                            alt={`${title} - Photo ${i + 1}`}
                            className="w-full h-auto object-contain bg-gray-100"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="flex items-center justify-center w-full h-32 bg-gray-100 text-gray-400 text-sm">Image not available</div>';
                              }
                            }}
                          />
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
                              <img
                                src={images[i]}
                                alt={`${title} - Photo ${i + 1}`}
                                className="w-full h-auto object-contain bg-gray-100"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="flex items-center justify-center w-full h-32 bg-gray-100 text-gray-400 text-sm">No Image</div>';
                                  }
                                }}
                              />
                            </div>
                            <div className="w-1/2">
                              <img
                                src={images[i + 1]}
                                alt={`${title} - Photo ${i + 2}`}
                                className="w-full h-auto object-contain bg-gray-100"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="flex items-center justify-center w-full h-32 bg-gray-100 text-gray-400 text-sm">No Image</div>';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        );
                        i += 2; // Skip next image as it's included
                      } else {
                        // Single image, make it full width
                        elements.push(
                          <div key={`full-${i}`} className="w-full">
                            <img
                              src={images[i]}
                              alt={`${title} - Photo ${i + 1}`}
                              className="w-full h-auto object-contain bg-gray-100"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<div class="flex items-center justify-center w-full h-32 bg-gray-100 text-gray-400 text-sm">Image not available</div>';
                                }
                              }}
                            />
                          </div>
                        );
                        i++;
                      }
                    } else if (positionInCycle === 3) {
                      // Image 4: Full width
                      elements.push(
                        <div key={`full-${i}`} className="w-full">
                          <img
                            src={images[i]}
                            alt={`${title} - Photo ${i + 1}`}
                            className="w-full h-auto object-contain bg-gray-100"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="flex items-center justify-center w-full h-32 bg-gray-100 text-gray-400 text-sm">Image not available</div>';
                              }
                            }}
                          />
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
                              <img
                                src={images[i]}
                                alt={`${title} - Photo ${i + 1}`}
                                className="w-full h-auto object-contain bg-gray-100"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="flex items-center justify-center w-full h-32 bg-gray-100 text-gray-400 text-sm">No Image</div>';
                                  }
                                }}
                              />
                            </div>
                            <div className="w-1/2">
                              <img
                                src={images[i + 1]}
                                alt={`${title} - Photo ${i + 2}`}
                                className="w-full h-auto object-contain bg-gray-100"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="flex items-center justify-center w-full h-32 bg-gray-100 text-gray-400 text-sm">No Image</div>';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        );
                        i += 2; // Skip next image as it's included
                      } else {
                        // Single image, make it full width
                        elements.push(
                          <div key={`full-${i}`} className="w-full">
                            <img
                              src={images[i]}
                              alt={`${title} - Photo ${i + 1}`}
                              className="w-full h-auto object-contain bg-gray-100"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<div class="flex items-center justify-center w-full h-32 bg-gray-100 text-gray-400 text-sm">Image not available</div>';
                                }
                              }}
                            />
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
    </div>
  );
}
