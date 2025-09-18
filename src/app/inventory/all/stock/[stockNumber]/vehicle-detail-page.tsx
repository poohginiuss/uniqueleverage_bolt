"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";
import { BadgeWithDot, BadgeWithIcon } from "@/components/base/badges/badges";
import { 
    ChevronDown,
    Colors,
    Cube01,
    Figma,
    File04,
    Flag05,
    Globe01,
    LayoutAlt01,
    MessageChatCircle,
    Settings01,
    Star06
} from "@untitledui/icons";
import VehicleGallery from "@/components/application/vehicle-gallery";
import { fetchVehicleData } from "@/lib/vehicle-data";

// Divider component
function Divider() {
  return (
    <hr className="my-10 md:my-12 border-t-2 border-border-secondary" />
  );
}

interface VehicleDetailPageProps {
  stockNumber: string;
}

function VehicleDetailPageContent({ stockNumber }: VehicleDetailPageProps) {
  const router = useRouter();
  
  // Get stockNumber from URL path
  const stock = stockNumber;
  
  // Get vehicle data - initialize with undefined to prevent hydration mismatch
  const [vehicle, setVehicle] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const loadVehicle = async () => {
      try {
        setError(null);
        const vehicles = await fetchVehicleData();
        const foundVehicle = vehicles.find(v => {
          const vehicleStock = v.stockNumber || `UL-${String(v.id).padStart(6, "0")}`;
          return vehicleStock === stock;
        });
        setVehicle(foundVehicle);
      } catch (error) {
        console.error('Error loading vehicle:', error);
        setError('Failed to load vehicle data');
      } finally {
        setLoading(false);
      }
    };
    
    loadVehicle();
  }, [stock, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Vehicle</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
          >
            Retry
          </button>
          <button
            onClick={() => router.push('/inventory/all')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
          <p className="text-gray-600 mb-8">The vehicle you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/inventory/all')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  // Create title from vehicle data
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`;

  // State for modals and interactions
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  // Prevent body scroll when modal is open and prevent horizontal scroll on VSP
  useEffect(() => {
    if (showTimeModal || showDateModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Always prevent horizontal scrolling on VSP page
    document.body.style.overflowX = 'hidden';
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.overflowX = 'unset';
    };
  }, [showTimeModal, showDateModal]);

  const Icon = ({ path }: { path: string }) => (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <main className="min-w-0 flex-1 bg-secondary_subtle pb-12 shadow-none lg:bg-primary">
        <header className="max-lg:hidden sticky top-0 z-50">
          <section className="flex h-15 pl-7 pr-7 w-full items-center justify-between bg-primary md:h-15 border-b border-secondary">                                                                                                          
            <Breadcrumbs type="button">
              <Breadcrumbs.Item href="#" onClick={() => router.push('/docs/introduction')}>Inventory</Breadcrumbs.Item>                                                                                                                       
              <Breadcrumbs.Item href="#" onClick={() => router.push('/inventory/all')}>All Inventory</Breadcrumbs.Item>                                         
              <Breadcrumbs.Item href="#">{title}</Breadcrumbs.Item>                                                                                      
            </Breadcrumbs>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">      
              <span>Account</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </section>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8 2xl:py-12 pt-8 md:pt-8">
          <div className="mx-auto max-w-7xl">
            <article className="min-w-0">
              <div className="mt-8">
                <h1 className="text-2xl font-semibold tracking-tight text-black">{title}</h1>
                <p className="mt-3 text-slate-600 leading-7 max-w-[70ch]">
                  View detailed information, schedule test drives, and manage this vehicle's marketing campaigns from a single page.                                                                                                       
                </p>
              </div>
              <div className="h-px bg-slate-200 my-8 sm:my-10 lg:my-12" />

          {/* Vehicle Gallery */}
          <div className="mb-8">
            <VehicleGallery 
              images={vehicle.images || []} 
              title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              stockNumber={vehicle.stockNumber}
            />
          </div>

      {/* Vehicle Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Vehicle Information */}
        <div className="space-y-6">
          {/* Price */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price</span>
                <span className="text-2xl font-bold text-gray-900">${vehicle.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Payment</span>
                <span className="text-lg font-semibold text-gray-900">${Math.round(vehicle.price / 60).toLocaleString()}/mo</span>
              </div>
            </div>
          </div>

          {/* Vehicle Specifications */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Icon path="M12 2L2 7l10 5 10-5-10-5z" />
                <div>
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="font-semibold text-gray-900">{vehicle.year}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Icon path="M12 2L2 7l10 5 10-5-10-5z" />
                <div>
                  <p className="text-sm text-gray-600">Make</p>
                  <p className="font-semibold text-gray-900">{vehicle.make}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Icon path="M12 2L2 7l10 5 10-5-10-5z" />
                <div>
                  <p className="text-sm text-gray-600">Model</p>
                  <p className="font-semibold text-gray-900">{vehicle.model}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Icon path="M12 2L2 7l10 5 10-5-10-5z" />
                <div>
                  <p className="text-sm text-gray-600">Trim</p>
                  <p className="font-semibold text-gray-900">{vehicle.trim || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Icon path="M12 2L2 7l10 5 10-5-10-5z" />
                <div>
                  <p className="text-sm text-gray-600">Mileage</p>
                  <p className="font-semibold text-gray-900">{vehicle.mileage.value.toLocaleString()} {vehicle.mileage.unit}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Icon path="M12 2L2 7l10 5 10-5-10-5z" />
                <div>
                  <p className="text-sm text-gray-600">Color</p>
                  <p className="font-semibold text-gray-900">{vehicle.color}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
            <div className="flex items-start space-x-3">
              <Icon path="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <div>
                <p className="font-semibold text-gray-900">{vehicle.address.city}, {vehicle.address.region}</p>
                <p className="text-gray-600">{vehicle.address.street}</p>
                <p className="text-gray-600">{vehicle.address.postalCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact & Actions */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Icon path="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <div>
                  <p className="font-semibold text-gray-900">{vehicle.dealer.name}</p>
                  <p className="text-gray-600">{vehicle.dealer.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Icon path="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <div>
                  <p className="font-semibold text-gray-900">{vehicle.dealer.email}</p>
                  <p className="text-gray-600">{vehicle.dealer.website}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Schedule Test Drive
              </button>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Get Financing
              </button>
              <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                Trade-In Value
              </button>
            </div>
          </div>
        </div>
      </div>
            </article>
          </div>
        </div>
    </main>
  );
}

export default function VehicleDetailPage({ stockNumber }: VehicleDetailPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VehicleDetailPageContent stockNumber={stockNumber} />
    </Suspense>
  );
}
