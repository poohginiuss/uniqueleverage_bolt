import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCalendlyOptimized } from '@/hooks/use-calendly-optimized';

interface VehicleGalleryProps {
  images: string[];
  title: string;
  stockNumber: string;
}

export default function VehicleGallery({ images, title, stockNumber }: VehicleGalleryProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const calendlyRef = useRef<HTMLDivElement>(null);
  const { initializeCalendly } = useCalendlyOptimized();
  
  // Immediate Calendly initialization - no delays
  useEffect(() => {
    if (calendlyRef.current) {
      // Try immediately, no delays
      initializeCalendly(
        calendlyRef.current,
        'https://calendly.com/uniqueleverage/scheduler?hide_event_type_details=1&hide_gdpr_banner=1'
      );
    }
  }, [initializeCalendly]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images && images.length > 1) {
      // Swipe left - next image
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
    
    if (isRightSwipe && images && images.length > 1) {
      // Swipe right - previous image
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const navigateToPhotoGallery = () => {
    router.push(`/inventory/all/stock/${stockNumber}/photos`);
  };

  return (
    <div>
      {/* Mobile: Single main image - full screen width, starts at header bottom */}
      <div className="md:hidden bg-slate-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity -mx-4 md:mx-0 relative" style={{ marginLeft: '-2rem', marginRight: '-2rem' }}>
        {images && images.length > 0 ? (
          <>
            <img 
              src={images[currentImageIndex]} 
              alt={title}
              className="w-full object-cover object-center transition-transform duration-300 ease-out"
              style={{ aspectRatio: '16/9' }}
              onClick={navigateToPhotoGallery}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="flex items-center justify-center w-full text-slate-400 text-sm" style="aspect-ratio: 16/9;">No Image Available</div>';
                }
              }}
            />
            
            {/* Navigation arrows - only show if multiple images */}
            {images.length > 1 && (
              <>
                {/* Left Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* Right Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev + 1) % images.length);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center w-full text-slate-400 text-sm" style={{ aspectRatio: '16/9' }}>
            No Image Available
          </div>
        )}
      </div>

      {/* Desktop: Full gallery layout */}
      <div className="hidden md:block relative">
        <div className="flex gap-1 h-64">
          {/* Main Image - left side */}
          <div className="flex-1 bg-slate-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" onClick={navigateToPhotoGallery}>
            {images && images.length > 0 ? (
              <img 
                src={images[0]} 
                alt={title}
                className="w-full h-full object-cover object-center"
                style={{ objectPosition: 'center 30%' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400 text-sm">No Image Available</div>';
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                No Image Available
              </div>
            )}
          </div>
          
          {/* Small Images - right side, 2x2 grid */}
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-1">
            {(images || []).slice(1, 5).map((image, i) => (
              <div key={i} className="bg-slate-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" onClick={navigateToPhotoGallery}>
                <img 
                  src={image} 
                  alt={`${title} - Image ${i + 2}`}
                  className="w-full h-full object-cover object-center"
                  style={{ objectPosition: 'center 30%' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400 text-xs">No Image</div>';
                    }
                  }}
                />
              </div>
            ))}
            {Array.from({ length: Math.max(0, 4 - (images?.length || 0) + 1) }).map((_, i) => (
              <div key={`placeholder-${i}`} className="bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                No Image
              </div>
            ))}
          </div>
        </div>
        
        {/* Calendly Inline Widget */}
        <div className="absolute top-72 right-0 z-20 hidden md:block md:w-[48%] lg:w-[48%] xl:w-[48%]">
          <div className="flex justify-end">
            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3 w-full max-w-sm">
              <div className="text-center mb-3">
                <h3 className="text-sm font-medium text-gray-900 mb-1">Schedule Test Drive</h3>
                <p className="text-xs text-gray-500">Book a time that works for you</p>
              </div>

              {/* Calendly Inline Widget */}
              <div 
                ref={calendlyRef}
                style={{ 
                  minWidth: '320px', 
                  height: '485px',
                  overflow: 'hidden',
                  borderRadius: '8px'
                }}
                className="calendly-widget-container"
              />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
