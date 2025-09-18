"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";
import { ChevronDown } from "@untitledui/icons";
import { FaApple, FaWindows } from "react-icons/fa";
import { fetchVehicleData, Vehicle } from "@/lib/vehicle-data";


export default function WizardPage() {
    const router = useRouter();
    
    return (
        <main className="min-w-0 flex-1 bg-secondary_subtle pb-12 shadow-none lg:bg-primary marketing-wizard page-transition content-area">
            <header className="max-lg:hidden sticky top-0 z-50">
                <section className="flex h-15 pl-7 pr-7 w-full items-center justify-between bg-primary md:h-15 border-b border-secondary">
                    <Breadcrumbs type="button">
                        <Breadcrumbs.Item href="#">Marketing</Breadcrumbs.Item>
                        <Breadcrumbs.Item href="#">Ad Wizard</Breadcrumbs.Item>
                    </Breadcrumbs>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span>Account</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                </section>
            </header>

            <div className="px-6 lg:px-8 py-8 pt-8 md:pt-8">
                <div className="mx-auto max-w-7xl">
                    <MarketingIntroPageNoTOC />
                </div>
            </div>
        </main>
    );
}

const MarketingIntroPageNoTOC = () => {
  // State management
  const [promotionType, setPromotionType] = useState<'single' | 'set'>('single');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('SUVs');
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [availableSets, setAvailableSets] = useState<any[]>([]);
  const [selectedSet, setSelectedSet] = useState<any>(null);
  const [destination, setDestination] = useState<'vsp' | 'messenger'>('vsp');
  const [headline, setHeadline] = useState('');
  const [callToAction, setCallToAction] = useState('Shop Now');
  const [primaryText, setPrimaryText] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateSetModal, setShowCreateSetModal] = useState(false);
  const [customSetName, setCustomSetName] = useState('');
  const [customFilters, setCustomFilters] = useState<any[]>([]);
  const [filterMatchType, setFilterMatchType] = useState<'all' | 'any'>('all');

  // Debounced search with minimum length requirement
  const MIN_SEARCH_LENGTH = 2;
  const DEBOUNCE_DELAY = 300;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= MIN_SEARCH_LENGTH) {
        setDebouncedSearchQuery(searchQuery);
        setIsSearching(true);
      } else {
        setDebouncedSearchQuery('');
        setIsSearching(false);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset searching state after filtering
  useEffect(() => {
    if (debouncedSearchQuery) {
      const timer = setTimeout(() => setIsSearching(false), 100);
      return () => clearTimeout(timer);
    }
  }, [debouncedSearchQuery]);

  // Fetch real vehicle data from inventory
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        const vehicleData = await fetchVehicleData();
        setVehicles(vehicleData);
        
        // Generate dynamic sets based on actual inventory
        const sets = generateVehicleSets(vehicleData);
        setAvailableSets(sets);
      } catch (error) {
        console.error('Error loading vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadVehicles();
  }, []);

  // Get available options for an attribute
  const getAttributeOptions = (attribute: string) => {
    const uniqueValues = Array.from(new Set(vehicles.map(vehicle => {
      const value = vehicle[attribute as keyof Vehicle];
      return value?.toString();
    }).filter(Boolean))).sort();
    
    return uniqueValues;
  };

  // Apply custom filters to vehicles
  const applyCustomFilters = (vehicleList: Vehicle[], filters: any[], matchType: 'all' | 'any') => {
    if (filters.length === 0) return vehicleList;
    
    return vehicleList.filter(vehicle => {
      const results = filters.map(filter => {
        if (!filter.attribute || !filter.condition || !filter.value) return false;
        
        const vehicleValue = vehicle[filter.attribute as keyof Vehicle];
        const filterValue = filter.value;
        
        switch (filter.condition) {
          case 'is_any_of':
            return vehicleValue?.toString().toLowerCase() === filterValue.toLowerCase();
          case 'is_not':
            return vehicleValue?.toString().toLowerCase() !== filterValue.toLowerCase();
          default:
            return false;
        }
      });
      
      return matchType === 'all' ? results.every(Boolean) : results.some(Boolean);
    });
  };

  // Generate vehicle sets based on actual inventory
  const generateVehicleSets = (vehicleData: Vehicle[]) => {
    const sets = [];
    
    // Count vehicles by body style
    const styleCounts = vehicleData.reduce((acc, vehicle) => {
      const style = vehicle.bodyStyle || 'Other';
      acc[style] = (acc[style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count luxury vehicles (over $30K)
    const luxuryCount = vehicleData.filter(v => v.price > 30000).length;
    
    // Count budget vehicles (under $20K)
    const budgetCount = vehicleData.filter(v => v.price < 20000).length;
    
    // Create sets based on actual data
    if (styleCounts['SUV'] > 0) {
      sets.push({ id: 1, name: 'SUV Collection', count: styleCounts['SUV'], description: 'All SUVs in inventory' });
    }
    if (luxuryCount > 0) {
      sets.push({ id: 2, name: 'Luxury Vehicles', count: luxuryCount, description: 'Premium cars and SUVs over $30K' });
    }
    if (budgetCount > 0) {
      sets.push({ id: 3, name: 'Budget Friendly', count: budgetCount, description: 'Vehicles under $20K' });
    }
    if (styleCounts['TRUCK'] > 0) {
      sets.push({ id: 4, name: 'Truck Fleet', count: styleCounts['TRUCK'], description: 'All pickup trucks' });
    }
    if (styleCounts['SEDAN'] > 0) {
      sets.push({ id: 5, name: 'Sedan Collection', count: styleCounts['SEDAN'], description: 'All sedans and cars' });
    }
    
    return sets;
  };

  const categories = ['SUVs', 'Trucks', 'Vans', 'Sedans', 'Under $10K'];

          // Filter vehicles based on debounced search only (no category filter for single listing)
          const filteredVehicles = vehicles.filter(vehicle => {
            const matchesSearch = debouncedSearchQuery === '' || 
              `${vehicle.year} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
            return matchesSearch;
          });

  // Auto-generate headline based on selection
  useEffect(() => {
    if (promotionType === 'single' && selectedVehicles.length === 1) {
      const vehicle = selectedVehicles[0];
      setHeadline(`${vehicle.year} ${vehicle.make} ${vehicle.model} - $${vehicle.price.toLocaleString()}`);
    } else if (promotionType === 'set' && selectedSet) {
      setHeadline(`${selectedSet.name} - ${selectedSet.count} Vehicles Available`);
    }
  }, [promotionType, selectedVehicles, selectedSet]);

  // Auto-generate primary text
  useEffect(() => {
    if (promotionType === 'single' && selectedVehicles.length === 1) {
      const vehicle = selectedVehicles[0];
      setPrimaryText(`Find your perfect ${vehicle.year} ${vehicle.make} ${vehicle.model} at an unbeatable price. Schedule a test drive today and experience the quality and reliability you deserve.`);
    } else if (promotionType === 'set' && selectedSet) {
      setPrimaryText(`Browse our curated collection of ${selectedSet.count} carefully selected vehicles. From budget-friendly options to premium models, we have something for every need and budget.`);
    }
  }, [promotionType, selectedVehicles, selectedSet]);

  const handlePromotionTypeChange = (type: 'single' | 'set') => {
    setPromotionType(type);
    setSelectedVehicles([]);
    setSelectedSet(null);
    setSearchQuery(''); // Clear search when switching types
  };

  const handleVehicleSelect = (vehicle: any) => {
    if (promotionType === 'single') {
      setSelectedVehicles([vehicle]);
    } else {
      setSelectedVehicles(prev => 
        prev.some(v => v.id === vehicle.id) 
          ? prev.filter(v => v.id !== vehicle.id)
          : [...prev, vehicle]
      );
    }
  };

  const handleSetSelect = (set: any) => {
    setSelectedSet(set);
    // Auto-populate vehicles for the set based on actual inventory
    const setVehicles = vehicles.filter(v => {
      switch (set.id) {
        case 1: // SUV Collection
          return v.bodyStyle === 'SUV';
        case 2: // Luxury Vehicles
          return v.price > 30000;
        case 3: // Budget Friendly
          return v.price < 20000;
        case 4: // Truck Fleet
          return v.bodyStyle === 'TRUCK';
        case 5: // Sedan Collection
          return v.bodyStyle === 'SEDAN';
        default:
          return false;
      }
    });
    setSelectedVehicles(setVehicles);
  };

  return (
    <article className="min-w-0">
      <div className="mt-8">
        <h1 className="text-2xl font-semibold tracking-tight text-black">Ad Wizard for Automotive</h1>
        <p className="mt-3 text-slate-600 leading-7 max-w-[70ch]">
          Create powerful carousel and single-image ads that drive customers to your vehicle-specific pages. 
          Connect your inventory to Facebook and Instagram with automated content generation.
        </p>
      </div>
      <div className="h-px bg-slate-200 my-10 lg:my-12" />
        
        {/* Compact Promotion Type Selection */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">What do you want to promote?</h2>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handlePromotionTypeChange('single')}
              className={`group relative p-3 rounded-lg border transition-all duration-200 ${
                promotionType === 'single'
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                  promotionType === 'single' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <svg className={`w-3 h-3 ${promotionType === 'single' ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Single Listing</div>
                  <div className="text-xs text-gray-500">One vehicle</div>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => handlePromotionTypeChange('set')}
              className={`group relative p-3 rounded-lg border transition-all duration-200 ${
                promotionType === 'set'
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                  promotionType === 'set' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <svg className={`w-3 h-3 ${promotionType === 'set' ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Inventory Set</div>
                  <div className="text-xs text-gray-500">Multiple vehicles</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Compact Vehicle Search */}
        {promotionType === 'single' && selectedVehicles.length === 0 && (
          <div className="mb-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by year, make, model, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '16px' }}
                className={`w-full px-3 py-2 pl-9 text-base border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  searchQuery.length > 0 && searchQuery.length < MIN_SEARCH_LENGTH
                    ? 'border-yellow-300 bg-yellow-50 focus:bg-white'
                    : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {isSearching && (
                <div className="absolute right-3 top-2.5">
                  <div className="w-4 h-4 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {loading ? (
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </span>
                ) : isSearching ? (
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </span>
                ) : debouncedSearchQuery ? (
                  <span className="font-medium text-blue-600">{filteredVehicles.length}</span>
                ) : (
                  <span className="font-medium text-gray-700">{vehicles.length}</span>
                )}
                <span className="ml-1">
                  {debouncedSearchQuery ? 'matches' : 'items in catalog'}
                </span>
              </div>
              {searchQuery.length > 0 && searchQuery.length < MIN_SEARCH_LENGTH && (
                <div className="text-xs text-yellow-600">
                  Type {MIN_SEARCH_LENGTH - searchQuery.length} more character{MIN_SEARCH_LENGTH - searchQuery.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compact Vehicle Selection Grid */}
        {promotionType === 'single' && debouncedSearchQuery && selectedVehicles.length === 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select Vehicle</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredVehicles.map((vehicle) => (
                <div 
                  key={vehicle.id} 
                  className={`group relative border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                    selectedVehicles.some(v => v.id === vehicle.id)
                      ? 'border-blue-300 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img 
                          src={vehicle.images[0]} 
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                        {vehicle.bodyStyle} • {vehicle.mileage.value.toLocaleString()} {vehicle.mileage.unit}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-blue-600">
                          ${vehicle.price.toLocaleString()}
                        </span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedVehicles.some(v => v.id === vehicle.id)
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedVehicles.some(v => v.id === vehicle.id) && (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compact Vehicle Sets */}
        {promotionType === 'set' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Vehicle Set</label>
            {loading ? (
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Loading sets...</span>
                </div>
              </div>
            ) : (
              <select 
                value={selectedSet?.id || ''}
                onChange={(e) => {
                  const setId = parseInt(e.target.value);
                  const set = availableSets.find(s => s.id === setId);
                  if (set) handleSetSelect(set);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              >
                <option value="">Choose a vehicle set...</option>
                {availableSets.map((set) => (
                  <option key={set.id} value={set.id}>
                    {set.name} ({set.count} vehicles) - {set.description}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

            {/* Selected Vehicles Display */}
            {selectedVehicles.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Selected Vehicles ({selectedVehicles.length})
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {selectedVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="group border-2 border-green-200 rounded-lg p-3 bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {vehicle.images && vehicle.images.length > 0 ? (
                            <img 
                              src={vehicle.images[0]} 
                              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h4>
                          <p className="text-sm font-bold text-green-600 mb-1">${vehicle.price.toLocaleString()}</p>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {vehicle.bodyStyle}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              {vehicle.mileage.value.toLocaleString()} {vehicle.mileage.unit}
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

        {/* Change Vehicle Button for Single Mode */}
        {promotionType === 'single' && selectedVehicles.length > 0 && (
          <div className="mt-4 mb-6">
            <button 
              onClick={() => setSelectedVehicles([])}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Change Vehicle
            </button>
          </div>
        )}

        {/* Compact Ad Destination */}
        {(selectedVehicles.length > 0 || selectedSet) && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Ad Destination</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Destination</label>
                <select 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value as 'vsp' | 'messenger')}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                >
                  <option value="vsp">Vehicle Scheduling Page (VSP)</option>
                  <option value="messenger">Facebook Messenger</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {destination === 'vsp' 
                    ? 'Drive traffic to your inventory pages'
                    : 'Start conversations with customers'
                  }
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1 font-medium">Destination URL:</p>
                <code className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                  {destination === 'vsp' 
                    ? `uniqueleverage.com/inventory/all/stock/${selectedVehicles.length > 0 ? selectedVehicles[0].id : 'vehicle-id'}`
                    : 'facebook.com/messages/t/your-page-id'
                  }
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Compact Ad Creative */}
        {(selectedVehicles.length > 0 || selectedSet) && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Ad Creative</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Headline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Add headline..."
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                    <span className="text-xs text-gray-400">{headline.length}/40</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">40 characters recommended</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  placeholder="Describe your offer..."
                  value={primaryText}
                  onChange={(e) => setPrimaryText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">125 characters recommended</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Call to Action</label>
                <select 
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                >
                  <option value="Shop Now">Shop Now</option>
                  <option value="Learn More">Learn More</option>
                  <option value="Get Quote">Get Quote</option>
                  <option value="Contact Us">Contact Us</option>
                  <option value="Schedule Test Drive">Schedule Test Drive</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Compact Campaign Settings */}
        {(selectedVehicles.length > 0 || selectedSet) && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Campaign Settings</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Lifetime Budget <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                    <input 
                      type="number" 
                      placeholder="100"
                      className="w-full pl-6 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Audience</label>
                  <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors">
                    <option value="broad">Broad Audience</option>
                    <option value="local">Local Area (25 miles)</option>
                    <option value="custom">Custom Audience</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Compact Create Campaign Button */}
        {(selectedVehicles.length > 0 || selectedSet) && (
          <div className="flex justify-center">
            <button 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!headline || !primaryText || selectedVehicles.length === 0}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Campaign
              </div>
            </button>
          </div>
        )}
    </article>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center my-4 md:my-8">
      <div className="w-12 md:w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full"></div>
    </div>
  );
}

function ActionCard({ href, title, subtitle, icon }: { href: string; title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col items-start rounded-xl bg-primary_alt p-5 ring-1 ring-secondary outline-focus-ring transition duration-100 ease-linear ring-inset hover:bg-primary_hover no-underline"
      href={href}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-primary">{title}</span>
          <span className="text-sm text-secondary">{subtitle}</span>
        </div>
      </div>
    </a>
  );
}