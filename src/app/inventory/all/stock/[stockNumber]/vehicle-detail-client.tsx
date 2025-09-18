"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";
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

interface VehicleDetailClientProps {
  stockNumber: string;
}

export default function VehicleDetailClient({ stockNumber }: VehicleDetailClientProps) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        setError(null);
        const vehicles = await fetchVehicleData();
        const foundVehicle = vehicles.find(v => {
          const vehicleStock = v.stockNumber || `UL-${String(v.id).padStart(6, "0")}`;
          return vehicleStock === stockNumber;
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
  }, [stockNumber]);

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

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`;

  return (
    <>
    <div className="min-w-0 md:mt-0 -mt-16 md:px-8 lg:px-8 py-8 max-w-4xl mx-auto">
      {/* Desktop: Title positioned to match inventory/all headline exactly */}
      <div className="hidden lg:block text-left mb-4 -mt-8">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">{title}</h1>
      </div>
      
      {/* Mobile/Tablet: Title positioned below breadcrumbs */}
      <div className="lg:hidden text-left mb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">{title}</h1>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs type="button">
        <Breadcrumbs.Item href="#" onClick={() => router.push('/')}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={() => router.push('/inventory')}>Inventory</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={() => router.push('/inventory/all')}>All Inventory</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">{title}</Breadcrumbs.Item>
      </Breadcrumbs>

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
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div>
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="font-semibold text-gray-900">{vehicle.year}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div>
                  <p className="text-sm text-gray-600">Make</p>
                  <p className="font-semibold text-gray-900">{vehicle.make}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div>
                  <p className="text-sm text-gray-600">Model</p>
                  <p className="font-semibold text-gray-900">{vehicle.model}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div>
                  <p className="text-sm text-gray-600">Trim</p>
                  <p className="font-semibold text-gray-900">{vehicle.trim || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div>
                  <p className="text-sm text-gray-600">Mileage</p>
                  <p className="font-semibold text-gray-900">{vehicle.mileage.value.toLocaleString()} {vehicle.mileage.unit}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
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
              <div className="w-5 h-5 bg-gray-300 rounded mt-1"></div>
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
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div>
                  <p className="font-semibold text-gray-900">{vehicle.dealer.name}</p>
                  <p className="text-gray-600">{vehicle.dealer.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
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
    </div>
    </>
  );
}
