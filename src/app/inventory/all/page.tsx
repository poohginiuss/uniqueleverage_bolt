"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";
import { BadgeWithDot, BadgeWithIcon } from "@/components/base/badges/badges";
import { ChevronDown } from "@untitledui/icons";
import { 
    Colors,
    Cube01,
    Figma,
    File04,
    Flag05,
    Globe01,
    LayoutAlt01,
    MessageChatCircle,
    Settings01,
    Star06,
} from "@untitledui/icons";
import { fetchVehicleData, Vehicle } from "@/lib/vehicle-data";
import VehicleGallery from "@/components/application/vehicle-gallery";
import { useSearch } from "@/hooks/use-search";
import { useCalendlyOptimized } from "@/hooks/use-calendly-optimized";

// Mock inventory data (same as MagicBackup)
const MODEL_NAMES = {
  Sedan: ["Civic", "Accord", "Corolla", "Camry", "Model 3"],
  Trucks: ["F-150", "Silverado", "Ram", "Tundra", "Ranger"],
  "Sport Utility": ["CR-V", "RAV4", "Highlander", "Tahoe", "Model Y"],
  "Side-by-Side": ["RZR", "Maverick", "Commander"],
  Trailers: ["Flatbed", "Enclosed", "Utility"],
  Hatchbacks: ["Golf", "Fit", "i30"],
  Motorcycle: ["Ninja", "CBR", "MT-07", "Bonneville"],
  Boats: ["Bayliner", "Sea Ray"],
};

const MAKE_BY_MODEL = {
  Civic: "Honda", Accord: "Honda", Corolla: "Toyota", Camry: "Toyota",
  "Model 3": "Tesla", "CR-V": "Honda", RAV4: "Toyota", Highlander: "Toyota",
  Tahoe: "Chevrolet", "Model Y": "Tesla", "F-150": "Ford", Silverado: "Chevrolet",
  Ram: "Ram", Tundra: "Toyota", Ranger: "Ford", RZR: "Polaris",
  Maverick: "Can-Am", Commander: "Can-Am", Flatbed: "Utility", Enclosed: "Utility",
  Utility: "Utility", Golf: "Volkswagen", Fit: "Honda", i30: "Hyundai",
  Ninja: "Kawasaki", CBR: "Honda", "MT-07": "Yamaha", Bonneville: "Triumph",
  Bayliner: "Bayliner", "Sea Ray": "Sea Ray",
};

const BASE_PRICE_BY_STYLE = { 
  Sedan: 16000, Trucks: 28000, "Sport Utility": 24000, "Side-by-Side": 12000, 
  Trailers: 6000, Hatchbacks: 14000, Motorcycle: 9000, Boats: 20000 
};

const NEW_DISTRIB = { Sedan: 10, Trucks: 14, "Sport Utility": 16, Hatchbacks: 6, Boats: 2, "Side-by-Side": 2 };
const PRE_DISTRIB = { Sedan: 8, Trucks: 12, "Sport Utility": 10, "Side-by-Side": 6, Trailers: 6, Hatchbacks: 4, Motorcycle: 4 };

const buildInventory = () => {
  const items: any[] = [];
  let id = 1;
  const seeded = (n: number) => { let x = ((n * 9301 + 49297) % 233280); return x / 233280; };
  const pushMany = (cond: any, map: any) => {
    if (!map) return;
    Object.entries(map).forEach(([style, qty]) => {
      const names = MODEL_NAMES[style as keyof typeof MODEL_NAMES] || ["Generic"];
      for (let i = 0; i < (qty as number); i++) {
        const model = names[i % names.length];
        const make = MAKE_BY_MODEL[model as keyof typeof MAKE_BY_MODEL] || "Generic";
        const s = BASE_PRICE_BY_STYLE[style as keyof typeof BASE_PRICE_BY_STYLE] || 15000;
        const r = seeded(id + (cond === "new" ? 1000 : 2000));
        const year = 2016 + Math.floor(seeded(id) * 9);
        const miles = cond === "new" ? Math.floor(1000 + r * 8000) : Math.floor(12000 + r * 52000);
        const price = Math.round((s + (cond === "new" ? 4000 : 0) + (r - 0.5) * 4000) / 10) * 10;
        items.push({ id: id++, condition: cond, style, model, make, year, miles, price });
      }
    });
  };
  pushMany("new", NEW_DISTRIB);
  pushMany("pre", PRE_DISTRIB);
  return items;
};

const INVENTORY = buildInventory();

const stockOf = (v: any) => `UL-${String(v.id).padStart(6, "0")}`;

// Function to extract actual trim level, filtering out features and body styles
const getTrimLevel = (trimString: string) => {
  if (!trimString) return '';
  
  // Common feature words that are NOT trim levels
  const featureWords = [
    'leather', 'sport', 'utility', 'pickup', 'sedan', 'coupe', 'hatchback', 
    'convertible', 'wagon', 'van', 'minivan', 'crew', 'cab', 'extended', 
    'regular', 'supercrew', 'supercab', 'double', 'single', 'extended', 
    'short', 'long', 'bed', 'ft', 'door', 'd', 'awd', 'fwd', 'rwd', '4wd',
    'automatic', 'manual', 'cvt', 'transmission', 'v6', 'v8', 'v4', 'i4',
    'diesel', 'gasoline', 'hybrid', 'electric', 'turbo', 'supercharged'
  ];
  
  // Split by spaces and filter out feature words
  const words = trimString.toLowerCase().split(' ');
  const trimWords = words.filter(word => 
    word.length > 0 && 
    !featureWords.includes(word) &&
    !word.match(/^\d+/) && // Remove numbers
    !word.match(/^\d+\.\d+/) // Remove decimals
  );
  
  // Return the first meaningful trim word, or empty string if none found
  return trimWords.length > 0 ? trimWords[0].charAt(0).toUpperCase() + trimWords[0].slice(1) : '';
};

export function InventoryAllPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { searchValue } = useSearch();
  const { openCalendlyPopup, isReady } = useCalendlyOptimized();
  
  // Get stockNumber from URL path
  const stockNumber = pathname.includes('/stock/') ? pathname.split('/stock/')[1] : null;
  
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(stockNumber || null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const selectedVehicle = useMemo(() => vehicles.find((v) => v.id === selectedVehicleId) || null, [selectedVehicleId, vehicles]);

  // Update URL when vehicle is selected
  useEffect(() => {
    if (selectedVehicleId && selectedVehicle) {
      const stockNumber = selectedVehicle.stockNumber || `UL-${String(selectedVehicle.id).padStart(6, "0")}`;
      const newUrl = `/inventory/all/stock/${stockNumber}`;
      router.push(newUrl);
    }
  }, [selectedVehicleId, selectedVehicle, router]);

  // Reset selection when URL changes to inventory/all (back button navigation)
  useEffect(() => {
    if (pathname === '/inventory/all' && selectedVehicleId) {
      console.log('Resetting selectedVehicleId from', selectedVehicleId, 'to null');
      setSelectedVehicleId(null);
    }
  }, [pathname, selectedVehicleId]);

  const [filters, setFilters] = useState<string[]>(["all"]);
  
  // Fetch vehicle data
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchVehicleData();
        setVehicles(data);
        console.log('Loaded CSV vehicles:', data.length);
      } catch (err) {
        console.error('Error loading vehicles:', err);
        setError('Failed to load vehicle data: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    loadVehicles();
  }, []);

  

  const view = "styles";

  const invAll = vehicles;

  const setByChip = (selectedFilters: string[]) => {
    let filteredVehicles;
    
    // If "all" is selected, show all vehicles
    if (selectedFilters.includes("all")) {
      filteredVehicles = invAll;
    } else {
      // Apply multiple filters - vehicle must match at least one filter
      filteredVehicles = vehicles.filter(v => {
        return selectedFilters.some(filter => {
          switch (filter) {
            case "sedan": return v.bodyStyle?.toLowerCase().includes('sedan');
            case "truck": return v.bodyStyle?.toLowerCase().includes('truck');
            case "suv": return v.bodyStyle?.toLowerCase().includes('suv') || v.bodyStyle?.toLowerCase().includes('sport utility');
            case "hatchback": return v.bodyStyle?.toLowerCase().includes('hatchback');
            case "coupe": return v.bodyStyle?.toLowerCase().includes('coupe');
            case "convertible": return v.bodyStyle?.toLowerCase().includes('convertible');
            case "incomplete": return !v.images || v.images.length === 0 || !v.make || !v.model;
            default: return false;
          }
        });
      });
    }
    
    // Apply search filter if search value exists
    if (searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase().trim();
      filteredVehicles = filteredVehicles.filter(v => 
        v.year?.toString().includes(searchTerm) ||
        v.make?.toLowerCase().includes(searchTerm) ||
        v.model?.toLowerCase().includes(searchTerm) ||
        v.bodyStyle?.toLowerCase().includes(searchTerm) ||
        v.vin?.toLowerCase().includes(searchTerm) ||
        v.stockNumber?.toLowerCase().includes(searchTerm) ||
        v.dealerName?.toLowerCase().includes(searchTerm) ||
        v.exteriorColor?.toLowerCase().includes(searchTerm) ||
        v.interiorColor?.toLowerCase().includes(searchTerm) ||
        v.transmission?.toLowerCase().includes(searchTerm) ||
        v.fuelType?.toLowerCase().includes(searchTerm) ||
        v.drivetrain?.toLowerCase().includes(searchTerm) ||
        v.mileage?.value?.toString().includes(searchTerm) ||
        v.price?.toString().includes(searchTerm) ||
        stockOf(v).toLowerCase().includes(searchTerm)
      );
    }
    
    return filteredVehicles;
  };


  const chips = [
    { key: "all", label: "All", count: setByChip(["all"]).length },
    { key: "sedan", label: "Sedan", count: vehicles.filter(v => v.bodyStyle?.toLowerCase().includes('sedan')).length },
    { key: "truck", label: "Truck", count: vehicles.filter(v => v.bodyStyle?.toLowerCase().includes('truck')).length },
    { key: "suv", label: "SUV", count: vehicles.filter(v => v.bodyStyle?.toLowerCase().includes('suv') || v.bodyStyle?.toLowerCase().includes('sport utility')).length },
    { key: "hatchback", label: "Hatchback", count: vehicles.filter(v => v.bodyStyle?.toLowerCase().includes('hatchback')).length },
    { key: "coupe", label: "Coupe", count: vehicles.filter(v => v.bodyStyle?.toLowerCase().includes('coupe')).length },
    { key: "convertible", label: "Convertible", count: vehicles.filter(v => v.bodyStyle?.toLowerCase().includes('convertible')).length },
    { key: "incomplete", label: "Incomplete", count: vehicles.filter(v => !v.images || v.images.length === 0 || !v.make || !v.model).length },
  ];


  const onTabChange = (key: string) => { 
    setFilters(prev => {
      if (key === "all") {
        return ["all"];
      }
      
      const newFilters = [...prev];
      const index = newFilters.indexOf(key);
      
      if (index > -1) {
        // Remove filter if already selected
        newFilters.splice(index, 1);
        // If no filters left, default to "all"
        if (newFilters.length === 0) {
          return ["all"];
        }
      } else {
        // Add filter if not selected
        // Remove "all" if it exists when adding specific filters
        const filteredNewFilters = newFilters.filter(f => f !== "all");
        filteredNewFilters.push(key);
        return filteredNewFilters;
      }
      
      return newFilters;
    });
  };

  return (
    <main className="min-w-0 flex-1 bg-secondary_subtle pb-12 shadow-none lg:bg-primary page-transition content-area">
        <header className="max-lg:hidden sticky top-0 z-50">
          <section className="flex h-15 pl-7 pr-7 w-full items-center justify-between bg-primary md:h-15 border-b border-secondary">                                                                                                          
            <Breadcrumbs type="button">
              <Breadcrumbs.Item href="#" onClick={() => router.push('/docs/introduction')}>Inventory</Breadcrumbs.Item>                                                                                                                       
              <Breadcrumbs.Item href="#" onClick={() => setSelectedVehicleId(null)}>{filters.length === 1 && filters[0] === "all" ? "All Inventory" : `${filters.length} filters`}</Breadcrumbs.Item>                                         
              {selectedVehicle && (
                <Breadcrumbs.Item href="#">Stock {selectedVehicle.stockNumber || `UL-${String(selectedVehicle.id).padStart(6, "0")}`}</Breadcrumbs.Item>                                                                                      
              )}
            </Breadcrumbs>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">      
              <span>Account</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </section>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8 pt-8 md:pt-8">
          <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading vehicle data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : selectedVehicle ? (
            <VehicleDetail vehicle={selectedVehicle} onBack={() => setSelectedVehicleId(null)} />
          ) : (
            <article className="min-w-0">
              <div className="mt-8">
                <h1 className="text-2xl font-semibold tracking-tight text-black">Inventory</h1>
                <p className="mt-3 text-slate-600 leading-7 max-w-[70ch]">
                  This is your live feed. Quickly access vehicles, launch marketing campaigns, and manage scheduling from a single dashboard.                                                                                                       
                </p>
              </div>
              <div className="h-px bg-slate-200 my-8 sm:my-10 lg:my-12" />


              {/* Content */}
              {view === "styles" ? (
                <section className="mt-8 sm:mt-10 lg:mt-12">
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-items-center">
                    {setByChip(filters).map((v) => (
                      <button 
                        key={v.id} 
                        onClick={() => {
                          console.log('Vehicle clicked:', v.id, v);
                          setSelectedVehicleId(v.id);
                          window.scrollTo(0, 0);
                        }} 
                        className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-500 hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-left w-full min-w-0 flex flex-col p-0"
                      >
                        {/* Image Container */}
                        <div className="relative w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: '16/9' }}>
                          {v.images && v.images.length > 0 ? (
                            <img 
                              src={v.images[0]} 
                              alt={`${v.year} ${v.make} ${v.model}`}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200 m-0 p-0"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                          {/* Vehicle Title & Key Info */}
                          <div className="mb-1.5">
                            <h3 className="font-semibold text-gray-900 text-[11px] leading-tight mb-1 line-clamp-2">
                              {v.year} {v.make} {v.model}{v.trim ? ` ${getTrimLevel(v.trim)}` : ''}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <span>{v.mileage.value.toLocaleString()} Miles</span>
                              <span className={`font-medium ${
                                parseInt(v.daysOnLot) < 30 ? 'text-gray-700' : 
                                parseInt(v.daysOnLot) < 90 ? 'text-gray-600' : 'text-gray-500'
                              }`}>
                                {v.daysOnLot}
                              </span>
                            </div>
                          </div>
                          
                          {/* Price & Stock */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">${v.price.toLocaleString()}</div>
                              {v.previousPrice && v.previousPrice !== v.price.toString() && (
                                <div className="text-xs text-gray-500 line-through">${parseInt(v.previousPrice).toLocaleString()}</div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500 font-mono">#{stockOf(v)}</div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                    {setByChip(filters).length === 0 && (
                      <div className="col-span-full rounded-xl border border-gray-200 p-12 text-center bg-white">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.804-6.2-2.15M15 6.708A7.962 7.962 0 0112 9c-2.34 0-4.5-.804-6.2-2.15" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                      </div>
                    )}
                  </div>
                </section>
              ) : (
                <section className="mt-12">
                  <h2 className="text-[20px] font-semibold">
                    {filters.length === 1 && filters[0] === "all" ? "All Vehicles" : `${filters.length} Filters Applied`}
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Showing {setByChip(filters).length} vehicles {filters.length === 1 && filters[0] === "all" ? "in inventory" : `matching ${filters.length} filter${filters.length > 1 ? 's' : ''}`}.
                  </p>
                  <div className="mt-6 grid gap-6 justify-items-center justify-center" style={{ gridTemplateColumns: 'repeat(auto-fit, 220px)' }}>
                    {setByChip(filters).map((v) => (
                      <button 
                        key={v.id} 
                        onClick={() => {
                          setSelectedVehicleId(v.id);
                          window.scrollTo(0, 0);
                        }} 
                        className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-500 hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-left w-full min-w-0 h-[250px] p-0"
                      >
                        <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
                          {v.images && v.images.length > 0 ? (
                            <img 
                              src={v.images[0]} 
                              alt={`${v.year} ${v.make} ${v.model}`}
                              className="w-full h-full object-cover object-center"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                                if (nextSibling) {
                                  nextSibling.style.display = 'block';
                                }
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm" style={{ display: v.images && v.images.length > 0 ? 'none' : 'flex' }}>
                            No Image
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-2.5">
                          {/* Vehicle Title & Key Info */}
                          <div className="mb-1.5">
                            <h3 className="font-semibold text-gray-900 text-[11px] leading-tight mb-1 line-clamp-2">
                              {v.year} {v.make} {v.model}{v.trim ? ` ${getTrimLevel(v.trim)}` : ''}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <span>{v.mileage.value.toLocaleString()} Miles</span>
                              <span className={`font-medium ${
                                parseInt(v.daysOnLot) < 30 ? 'text-gray-700' : 
                                parseInt(v.daysOnLot) < 90 ? 'text-gray-600' : 'text-gray-500'
                              }`}>
                                {v.daysOnLot}
                              </span>
                            </div>
                          </div>
                          
                          {/* Price & Stock */}
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-bold text-gray-900">
                              ${v.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              {stockOf(v)}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                    {setByChip(filters).length === 0 && (
                      <div className="col-span-full rounded-xl border border-slate-200 p-6 text-slate-600">
                        No vehicles match this filter.
                      </div>
                    )}
                  </div>
                </section>
              )}
            </article>
          )}
          </div>
        </div>

      </main>
  );
}

export default function InventoryAllPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InventoryAllPageContent />
    </Suspense>
  );
}

// Vehicle Detail Component
const VehicleDetail = ({ vehicle, onBack }: { vehicle: Vehicle | null; onBack: () => void }) => {
  if (!vehicle) return null;
  
  const stock = vehicle.stockNumber || `UL-${String(vehicle.id).padStart(6, "0")}`;
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${getTrimLevel(vehicle.trim)}` : ''}`;
  const estMonthly = Math.max(199, Math.round((vehicle.price - 2000) / 47));
  const pretty = (n: number) => n.toLocaleString();

  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("1:00pm EST");
  const [payment, setPayment] = useState("Cash");
  const [showMoreDetails, setShowMoreDetails] = useState(false);
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
    <>
    <div className="min-w-0 md:mt-0 -mt-16 md:px-8 lg:px-8 py-8 max-w-4xl mx-auto"> {/* -mt-16 to pull image up to touch header on mobile/tablet, no horizontal padding on mobile, md:px-8 lg:px-8 for tablet/desktop, max-w-4xl for better readability */}
      {/* Desktop: Title positioned to match inventory/all headline exactly */}
      <div className="hidden lg:block text-left mb-4 -mt-8">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">{title}</h1>
      </div>
      
      {/* Tablet: Title above image */}
      <div className="hidden md:block lg:hidden text-left mb-6 -mt-8">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">{title}</h1>
      </div>

      {/* Gallery */}
      <VehicleGallery images={vehicle.images || []} title={title} />


      {/* Mobile: Floating Card */}
      <div className="md:hidden -mt-4 relative z-10">
        <div className="bg-white rounded-t-3xl p-6 -mx-4 pb-4" style={{ marginLeft: '-2rem', marginRight: '-2rem' }}>
          {/* Vehicle Title */}
          <div className="mb-6 text-center">
            <h1 className="text-lg font-semibold text-primary mb-1 truncate">{title}</h1>
             <div className="text-tertiary mb-1 text-sm">
               Located in Detroit, Michigan
          </div>
            <div className="text-tertiary text-sm mb-1">
              {vehicle.mileage.value.toLocaleString()} miles
        </div>
          </div>

          {/* Dealer Info Above Divider */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary_alt border border-secondary flex items-center justify-center overflow-hidden">
                <img 
                  src="/avatar/nathan.jpeg" 
                  alt="Nathan" 
              className="w-full h-full object-cover"
            />
          </div>
              <div>
                <div className="font-semibold text-primary text-sm">Listed by Nathan</div>
                <div className="text-tertiary text-sm">Autoplex MKE</div>
        </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-slate-200 mb-6 w-full md:w-1/2" />

          {/* Key Features */}
          <div className="mb-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-fg-secondary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-medium text-primary text-sm">Perfect CARFAX history</div>
                  <div className="text-tertiary text-sm">No accidents, 1-owner vehicle.</div>
        </div>
      </div>

              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-fg-secondary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="font-medium text-primary text-sm">Schedule test drive</div>
                  <div className="text-tertiary text-sm">Book your appointment online.</div>
              </div>
              </div>
              
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-fg-secondary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                <div>
                  <div className="font-medium text-primary text-sm">Available for delivery</div>
                  <div className="text-tertiary text-sm">Home delivery options available.</div>
                </div>
              </div>
              </div>
            </div>

          {/* Divider */}
          <hr className="border-slate-200 mb-6" />

          {/* Vehicle Description */}
          <div className="mb-6">
            <p className="text-tertiary leading-relaxed text-sm">
              Welcome to this {vehicle.year} {vehicle.make} {vehicle.model}! This well-maintained vehicle features a {vehicle.fuelType.toLowerCase()} engine, {vehicle.transmission.toLowerCase()} transmission, and {vehicle.drivetrain.toLowerCase()} drivetrain. With {vehicle.mileage.value.toLocaleString()} miles and a clean CARFAX history, this vehicle is perfect for your daily commute or weekend adventures. Located in {vehicle.address.city}, {vehicle.address.region}, with easy access to major highways and local amenities...
            </p>
            
            {showMoreDetails && (
              <div className="mt-4">
                <h3 className="font-medium text-primary mb-4 text-base">About this vehicle</h3>
                <div className="space-y-3">
                  
              <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-tertiary text-sm">{vehicle.transmission} transmission</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                    <span className="text-tertiary text-sm">Exterior color: {vehicle.exteriorColor || 'Unknown'} · Interior color: {vehicle.interiorColor || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="text-tertiary text-sm">4/5 overall NHTSA safety rating</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-tertiary text-sm">Fuel type: {vehicle.fuelType}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                    <span className="text-tertiary text-sm">25.0 MPG city · 33.0 MPG highway · 28.0 MPG combined</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-tertiary text-sm">This vehicle is paid off</span>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              className="mt-4 w-full py-2 px-4 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {showMoreDetails ? 'Show less' : 'Show more'}
            </button>
          </div>

          {/* Divider */}
          <hr className="border-slate-200 mb-6" />

          {/* Location */}
                <div>
            <h2 className="text-lg font-medium text-slate-900 mb-2">Where you'll be</h2>
            <div className="text-xs text-tertiary mb-3">
              {vehicle.address.city}, {vehicle.address.region}, United States
                </div>
            <div className="w-full h-80 rounded-lg overflow-hidden border border-slate-200 relative">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-83.04575368400567!3d42.33142737933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8824ca0110cb1d75%3A0x9c445c79d4739b35!2sDetroit%2C%20MI!5e0!3m2!1sen!2sus!4v1625093742000!5m2!1sen!2sus`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              />
              </div>
            
            {/* Calendar Section - Slim like Airbnb */}
            <div className="max-w-sm mx-auto lg:hidden" style={{display: 'none'}} data-calendar-section>
              <div className="mb-3">
                <h3 className="text-lg font-medium text-slate-900 mb-1">Let's Talk</h3>
                <p className="text-sm text-slate-600">{selectedDate || "Select a date"}</p>
            </div>

              {/* Month header with navigation - edge to edge like Airbnb */}
              <div className="flex items-center justify-between mb-3">
                <button className="p-1 hover:bg-slate-100 rounded">
                  <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="text-sm font-medium text-slate-900">September 2025</div>
                <button className="p-1 hover:bg-slate-100 rounded">
                  <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
            </div>
              
              <div className="grid grid-cols-7 gap-0 text-center mb-3">
                {/* Days of week - slightly darker like Airbnb */}
                <div className="text-xs text-slate-500 py-2">S</div>
                <div className="text-xs text-slate-500 py-2">M</div>
                <div className="text-xs text-slate-500 py-2">T</div>
                <div className="text-xs text-slate-500 py-2">W</div>
                <div className="text-xs text-slate-500 py-2">T</div>
                <div className="text-xs text-slate-500 py-2">F</div>
                <div className="text-xs text-slate-500 py-2">S</div>
                
                {/* Calendar dates */}
                <div className="text-sm text-slate-300 py-2">25</div>
                <div className="text-sm text-slate-300 py-2">26</div>
                <div className="text-sm text-slate-300 py-2">27</div>
                <div className="text-sm text-slate-300 py-2">28</div>
                <div className="text-sm text-slate-300 py-2">29</div>
                <div className="text-sm text-slate-300 py-2">30</div>
                <div className="text-sm text-slate-300 py-2">31</div>
                
                <div className="text-sm text-slate-300 py-2">1</div>
                <div className="text-sm text-slate-300 py-2">2</div>
                <div className="text-sm text-slate-300 py-2">3</div>
                <div className="text-sm text-slate-300 py-2">4</div>
                <div className="text-sm text-slate-300 py-2">5</div>
                <div className="text-sm text-slate-300 py-2">6</div>
                <div className="text-sm text-slate-300 py-2">7</div>
                
                <div className="text-sm text-slate-300 py-2">8</div>
                <div className="text-sm text-slate-300 py-2">9</div>
                <div className="text-sm text-slate-300 py-2">10</div>
                <div className="text-sm text-slate-300 py-2">11</div>
                <div className="text-sm text-slate-300 py-2">12</div>
                <div className="text-sm text-slate-300 py-2">13</div>
                <div className="text-sm text-slate-300 py-2">14</div>
                
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 15, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 15, 2025")}>15</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 16, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 16, 2025")}>16</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 17, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 17, 2025")}>17</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 18, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 18, 2025")}>18</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 19, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 19, 2025")}>19</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 20, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 20, 2025")}>20</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 21, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 21, 2025")}>21</div>
                
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 22, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 22, 2025")}>22</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 23, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 23, 2025")}>23</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 24, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 24, 2025")}>24</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 25, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 25, 2025")}>25</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 26, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 26, 2025")}>26</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 27, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 27, 2025")}>27</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 28, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 28, 2025")}>28</div>
                
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 29, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 29, 2025")}>29</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 30, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 30, 2025")}>30</div>
                <div className="text-sm text-slate-300 py-2">1</div>
                <div className="text-sm text-slate-300 py-2">2</div>
                <div className="text-sm text-slate-300 py-2">3</div>
                <div className="text-sm text-slate-300 py-2">4</div>
                <div className="text-sm text-slate-300 py-2">5</div>
              </div>
              
              <div 
                className="text-sm text-slate-600 underline cursor-pointer hover:text-slate-800"
                onClick={() => {
                  setSelectedDate("");
                  setSelectedTime("");
                }}
              >
                Clear dates
              </div>
            </div>
            </div>
        </div>
      </div>


      {/* Tablet/Desktop: Same as Mobile Layout */}
      <div className="hidden md:block mt-2 relative z-10">
        <div className="bg-white rounded-t-3xl p-6 -mx-4 pb-4">
          {/* Location and Mileage */}
          <div className="mb-4 text-left">
             <div className="font-semibold text-primary mb-1">
               Located in Detroit, Michigan
      </div>
            <div className="text-tertiary text-sm mb-1">
              {vehicle.mileage.value.toLocaleString()} miles
            </div>
          </div>


          {/* Tablet: Dealer Info Above Divider */}
          <div className="hidden md:block lg:hidden mb-6 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary_alt border border-secondary flex items-center justify-center overflow-hidden">
                <img 
                  src="/avatar/nathan.jpeg" 
                  alt="Nathan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-primary text-sm">Listed by Nathan</div>
                <div className="text-tertiary text-sm">Autoplex MKE</div>
              </div>
            </div>
          </div>

          {/* Desktop: Dealer Info Above Divider */}
          <div className="hidden lg:block mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary_alt border border-secondary flex items-center justify-center overflow-hidden">
                <img 
                  src="/avatar/nathan.jpeg" 
                  alt="Nathan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-primary text-sm">Listed by Nathan</div>
                <div className="text-tertiary text-sm">Autoplex MKE</div>
              </div>
            </div>
          </div>


          {/* Tablet/Desktop: Divider below mileage */}
          <div className="hidden md:block mb-6">
            <div className="w-1/2 border-t border-gray-200"></div>
          </div>

          {/* Desktop/Tablet: Key Features */}
          <div className="hidden md:block mb-6 mt-2">
              <div className="mb-6">
                {/* Key Features */}
                <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary_alt border border-secondary flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                <div>
                      <div className="font-semibold text-primary text-sm">Perfect CARFAX history</div>
                      <div className="text-tertiary text-sm">No accidents, 1-owner vehicle.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary_alt border border-secondary flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 7h12v9a1 1 0 01-1 1H5a1 1 0 01-1-1V7z" />
                        <path d="M9 9a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      </svg>
                    </div>
                <div>
                      <div className="font-semibold text-primary text-sm">Schedule test drive</div>
                      <div className="text-tertiary text-sm">Book your appointment online.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary_alt border border-secondary flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                <div>
                      <div className="font-semibold text-primary text-sm">Available for delivery</div>
                      <div className="text-tertiary text-sm">Home delivery options available.</div>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Only: Single column layout */}
          <div className="md:hidden mb-6">
            {/* Dealer Info Above Divider */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary_alt border border-secondary flex items-center justify-center overflow-hidden">
                  <img 
                    src="/avatar/nathan.jpeg" 
                    alt="Nathan" 
                className="w-full h-full object-cover"
              />
            </div>
                <div>
                  <div className="font-semibold text-primary text-sm">Listed by Nathan</div>
                  <div className="text-tertiary text-sm">Autoplex MKE</div>
          </div>
                </div>
              </div>
            </div>

          {/* Divider */}
          <hr className="border-slate-200 mb-6 w-full md:w-1/2" />

          {/* Vehicle Description */}
          <div className="mb-6 md:w-1/2">
            <p className="text-tertiary leading-relaxed text-sm">
              Welcome to this {vehicle.year} {vehicle.make} {vehicle.model}! This well-maintained vehicle features a {vehicle.fuelType.toLowerCase()} engine, {vehicle.transmission.toLowerCase()} transmission, and {vehicle.drivetrain.toLowerCase()} drivetrain. With {vehicle.mileage.value.toLocaleString()} miles and a clean CARFAX history, this vehicle is perfect for your daily commute or weekend adventures. Located in {vehicle.address.city}, {vehicle.address.region}, with easy access to major highways and local amenities...
            </p>
            
            {showMoreDetails && (
              <div className="mt-4">
                <h3 className="font-medium text-primary mb-4 text-base">About this vehicle</h3>
                <div className="space-y-3">
                  
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
                    <span className="text-tertiary text-sm">{vehicle.transmission} transmission</span>
            </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
                    <span className="text-tertiary text-sm">{vehicle.fuelType} Engine</span>
        </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-tertiary text-sm">{vehicle.drivetrain || 'Unknown Drivetrain'}</span>
        </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-tertiary text-sm">{vehicle.interiorColor || 'Unknown'} Interior</span>
              </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-tertiary text-sm">{vehicle.exteriorColor || 'Unknown'} Exterior</span>
            </div>
            </div>
              </div>
            )}

            <button 
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              className="mt-4 w-full py-2 px-4 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {showMoreDetails ? 'Show less' : 'Show more'}
            </button>
          </div>

          {/* Divider */}
          <hr className="border-slate-200 mb-6" />

          {/* Location */}
              <div>
              <h2 className="text-lg font-medium text-slate-900 mb-2">Where you'll be</h2>
              <div className="text-xs text-tertiary mb-3">
                {vehicle.address.city}, {vehicle.address.region}, United States
            </div>
              <div className="w-full h-80 rounded-lg overflow-hidden border border-slate-200 relative">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-83.04575368400567!3d42.33142737933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8824ca0110cb1d75%3A0x9c445c79d4739b35!2sDetroit%2C%20MI!5e0!3m2!1sen!2sus!4v1625093742000!5m2!1sen!2sus`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Divider */}
            <hr className="border-slate-200 my-6" />
            
            {/* Calendar Section - Tablet/Desktop */}
            <div className="max-w-sm mx-auto mt-6 lg:hidden" style={{display: 'none'}}>
              <div className="mb-3">
                <h3 className="text-lg font-medium text-slate-900 mb-1">Let's Talk</h3>
                <p className="text-sm text-slate-600">{selectedDate || "Select a date"}</p>
              </div>
                
              {/* Month header with navigation */}
              <div className="flex items-center justify-between mb-3">
                <button className="p-1 hover:bg-slate-100 rounded">
                  <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
                </button>
                <div className="text-sm font-medium text-slate-900">September 2025</div>
                <button className="p-1 hover:bg-slate-100 rounded">
                  <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
            </div>
                
              <div className="grid grid-cols-7 gap-0 text-center mb-3">
                {/* Days of week */}
                <div className="text-xs text-slate-500 py-2">S</div>
                <div className="text-xs text-slate-500 py-2">M</div>
                <div className="text-xs text-slate-500 py-2">T</div>
                <div className="text-xs text-slate-500 py-2">W</div>
                <div className="text-xs text-slate-500 py-2">T</div>
                <div className="text-xs text-slate-500 py-2">F</div>
                <div className="text-xs text-slate-500 py-2">S</div>
                
                {/* Calendar dates */}
                <div className="text-sm text-slate-300 py-2">25</div>
                <div className="text-sm text-slate-300 py-2">26</div>
                <div className="text-sm text-slate-300 py-2">27</div>
                <div className="text-sm text-slate-300 py-2">28</div>
                <div className="text-sm text-slate-300 py-2">29</div>
                <div className="text-sm text-slate-300 py-2">30</div>
                <div className="text-sm text-slate-300 py-2">31</div>
                
                <div className="text-sm text-slate-300 py-2">1</div>
                <div className="text-sm text-slate-300 py-2">2</div>
                <div className="text-sm text-slate-300 py-2">3</div>
                <div className="text-sm text-slate-300 py-2">4</div>
                <div className="text-sm text-slate-300 py-2">5</div>
                <div className="text-sm text-slate-300 py-2">6</div>
                <div className="text-sm text-slate-300 py-2">7</div>
                
                <div className="text-sm text-slate-300 py-2">8</div>
                <div className="text-sm text-slate-300 py-2">9</div>
                <div className="text-sm text-slate-300 py-2">10</div>
                <div className="text-sm text-slate-300 py-2">11</div>
                <div className="text-sm text-slate-300 py-2">12</div>
                <div className="text-sm text-slate-300 py-2">13</div>
                <div className="text-sm text-slate-300 py-2">14</div>
                
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 15, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 15, 2025")}>15</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 16, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 16, 2025")}>16</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 17, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 17, 2025")}>17</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 18, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 18, 2025")}>18</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 19, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 19, 2025")}>19</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 20, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 20, 2025")}>20</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 21, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 21, 2025")}>21</div>
                
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 22, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 22, 2025")}>22</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 23, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 23, 2025")}>23</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 24, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 24, 2025")}>24</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 25, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 25, 2025")}>25</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 26, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 26, 2025")}>26</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 27, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 27, 2025")}>27</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 28, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 28, 2025")}>28</div>
                
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 29, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 29, 2025")}>29</div>
                <div className={`text-sm py-2 hover:bg-slate-100 rounded cursor-pointer ${selectedDate === "Sep 30, 2025" ? "w-12 h-12 flex items-center justify-center rounded-full bg-black text-white" : "text-slate-700"}`} onClick={() => setSelectedDate("Sep 30, 2025")}>30</div>
              </div>
                </div>
        </div>


        </div>






      {/* Mobile: Sticky Bottom CTA Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl border-t border-slate-200">
        <div className="px-5 py-3 pb-safe">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {!selectedDate ? (
                // Initial state: Show price and payment info
                <>
                  <div className="text-base font-bold text-slate-900">
                    ${pretty(vehicle.price)}
                  </div>
                  <div className="text-sm text-slate-600">
                    Est. ${estMonthly}/mo
                  </div>
                </>
              ) : (
                // After date selected: Show date/time selection
                <>
                  <div className="text-base font-bold text-slate-900">
                    {selectedDate}
                  </div>
                  <div className="text-sm text-slate-600">
                    {selectedTime ? selectedTime : "Select a time"}
                  </div>
                </>
              )}
              </div>
              <button
                onClick={() => {
                  // Open Calendly popup directly
                  if (typeof window !== 'undefined' && (window as any).Calendly) {
                    (window as any).Calendly.initPopupWidget({
                      url: 'https://calendly.com/uniqueleverage/scheduler?hide_event_type_details=1&hide_gdpr_banner=1'
                    });
                  }
                }}
                className={`px-7 py-3 rounded-full text-base font-medium transition-colors ml-4 ${
                  !selectedDate
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : selectedTime
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Select Date
              </button>
          </div>
                </div>
            </div>

      {/* Bottom spacer for mobile */}
      <div className="md:hidden h-20"></div>

      {/* Time Selection Modal */}
      {showTimeModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20">
          <div className="bg-white rounded-t-3xl w-full h-[85vh] overflow-y-auto transform transition-transform duration-300 ease-out">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <button 
                onClick={() => setShowTimeModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
              <h2 className="text-lg font-semibold text-slate-900">Select time</h2>
              <button 
                onClick={() => setShowTimeModal(false)}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                Clear
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-6">Choose your preferred time slot</p>
              
              {/* Time Slots */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      setSelectedTime("9:00 AM");
                      setShowTimeModal(false);
                    }}
                    className="p-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  >
                    9:00 AM
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedTime("10:00 AM");
                      setShowTimeModal(false);
                    }}
                    className="p-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  >
                    10:00 AM
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedTime("11:00 AM");
                      setShowTimeModal(false);
                    }}
                    className="p-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  >
                    11:00 AM
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedTime("12:00 PM");
                      setShowTimeModal(false);
                    }}
                    className="p-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  >
                    12:00 PM
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedTime("1:00 PM");
                      setShowTimeModal(false);
                    }}
                    className="p-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  >
                    1:00 PM
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedTime("2:00 PM");
                      setShowTimeModal(false);
                    }}
                    className="p-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  >
                    2:00 PM
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedTime("3:00 PM");
                      setShowTimeModal(false);
                    }}
                    className="p-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  >
                    3:00 PM
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedTime("4:00 PM");
                      setShowTimeModal(false);
                    }}
                    className="p-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  >
                    4:00 PM
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>


    {/* Tablet: Sticky Bottom CTA Bar - REMOVED */}
    <div className="hidden fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl border-t border-slate-200">
      <div className="px-5 py-3 pb-safe">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {!selectedDate ? (
              // Initial state: Show price and payment info
              <>
                <div className="text-base font-bold text-slate-900">
                  ${pretty(vehicle.price)}
                </div>
                <div className="text-sm text-slate-600">
                  Est. ${estMonthly}/mo
                </div>
              </>
            ) : (
              // After date selected: Show date/time selection
              <>
                <div className="text-base font-bold text-slate-900">
                  {selectedDate}
                </div>
                <div className="text-sm text-slate-600">
                  {selectedTime ? selectedTime : "Select a time"}
                </div>
              </>
            )}
          </div>
            <button
              onClick={() => {
                if (!selectedDate) {
                  // Initial state: Scroll to calendar to select date
                  const calendarElement = document.querySelector('[data-calendar-section]');
                  if (calendarElement) {
                    calendarElement.scrollIntoView({ behavior: 'smooth' });
                  }
                  return;
                }
                if (selectedTime) return; // Ready to schedule
                setShowTimeModal(true); // Check availability
              }}
              className={`px-7 py-3 rounded-full text-base font-medium transition-colors ml-4 ${
                !selectedDate
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : selectedTime
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {!selectedDate ? "Select Date" : selectedTime ? "Schedule" : "Check Availability"}
            </button>
          </div>
      </div>
      </div>

      {/* Date Selection Overlay - Airbnb Style */}
      {showDateModal && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop - click to close */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-20"
            onClick={() => setShowDateModal(false)}
          />
          
          {/* Calendar Panel - Right Side */}
          <div className="absolute top-0 right-0 h-full w-96 bg-white shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add dates for prices</h2>
                <button 
                  onClick={() => setShowDateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Date Input Fields */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wide mb-1">CHECK-IN</label>
                    <div className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500">
                      MM/DD/YYYY
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wide mb-1">CHECKOUT</label>
                    <div className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500">
                      Add date
                    </div>
                  </div>
                </div>
              </div>

              {/* Dual Calendar */}
              <div className="space-y-6">
                {/* September 2025 Calendar */}
              <div>
                  <div className="flex items-center justify-between mb-3">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                    </button>
                    <div className="text-sm font-medium text-gray-900">September 2025</div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-0 text-center">
                    {/* Days of week */}
                    <div className="text-xs text-gray-500 py-2">S</div>
                    <div className="text-xs text-gray-500 py-2">M</div>
                    <div className="text-xs text-gray-500 py-2">T</div>
                    <div className="text-xs text-gray-500 py-2">W</div>
                    <div className="text-xs text-gray-500 py-2">T</div>
                    <div className="text-xs text-gray-500 py-2">F</div>
                    <div className="text-xs text-gray-500 py-2">S</div>
                    
                    {/* Calendar dates */}
                    <div className="text-sm text-gray-300 py-2">25</div>
                    <div className="text-sm text-gray-300 py-2">26</div>
                    <div className="text-sm text-gray-300 py-2">27</div>
                    <div className="text-sm text-gray-300 py-2">28</div>
                    <div className="text-sm text-gray-300 py-2">29</div>
                    <div className="text-sm text-gray-300 py-2">30</div>
                    <div className="text-sm text-gray-300 py-2">31</div>
                    
                    <div className="text-sm text-gray-300 py-2">1</div>
                    <div className="text-sm text-gray-300 py-2">2</div>
                    <div className="text-sm text-gray-300 py-2">3</div>
                    <div className="text-sm text-gray-300 py-2">4</div>
                    <div className="text-sm text-gray-300 py-2">5</div>
                    <div className="text-sm text-gray-300 py-2">6</div>
                    <div className="text-sm text-gray-300 py-2">7</div>
                    
                    <div className="text-sm text-gray-300 py-2">8</div>
                    <div className="text-sm text-gray-300 py-2">9</div>
                    <div className="text-sm text-gray-300 py-2">10</div>
                    <div className="text-sm text-gray-300 py-2">11</div>
                    <div className="text-sm text-gray-300 py-2">12</div>
                    <div className="text-sm text-gray-300 py-2">13</div>
                    <div className="text-sm text-gray-300 py-2">14</div>
                    
                    <div className="text-sm text-gray-300 py-2">15</div>
                    <div className="text-sm text-gray-300 py-2">16</div>
                    <div className="text-sm text-gray-300 py-2">17</div>
                    <div className="text-sm text-gray-300 py-2">18</div>
                    <div className="text-sm text-gray-300 py-2">19</div>
                    <div className="text-sm text-gray-300 py-2">20</div>
                    <div className="text-sm text-gray-300 py-2">21</div>
                    
                    <div className="text-sm text-gray-300 py-2">22</div>
                    <div className="text-sm text-gray-300 py-2">23</div>
                    <div className="text-sm text-gray-300 py-2">24</div>
                    <div className="text-sm text-gray-300 py-2">25</div>
                    <div className="text-sm text-gray-300 py-2">26</div>
                    <div className="text-sm text-gray-300 py-2">27</div>
                    <div className="text-sm text-gray-300 py-2">28</div>
                    
                    <div className="text-sm text-gray-300 py-2">29</div>
                    <div className="text-sm text-gray-300 py-2">30</div>
                    <div className="text-sm text-gray-300 py-2">1</div>
                    <div className="text-sm text-gray-300 py-2">2</div>
                    <div className="text-sm text-gray-300 py-2">3</div>
                    <div className="text-sm text-gray-300 py-2">4</div>
                    <div className="text-sm text-gray-300 py-2">5</div>
                </div>
              </div>

                {/* October 2025 Calendar */}
              <div>
                  <div className="flex items-center justify-between mb-3">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                    </button>
                    <div className="text-sm font-medium text-gray-900">October 2025</div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-0 text-center">
                    {/* Days of week */}
                    <div className="text-xs text-gray-500 py-2">S</div>
                    <div className="text-xs text-gray-500 py-2">M</div>
                    <div className="text-xs text-gray-500 py-2">T</div>
                    <div className="text-xs text-gray-500 py-2">W</div>
                    <div className="text-xs text-gray-500 py-2">T</div>
                    <div className="text-xs text-gray-500 py-2">F</div>
                    <div className="text-xs text-gray-500 py-2">S</div>
                    
                    {/* Calendar dates */}
                    <div className="text-sm text-gray-300 py-2">29</div>
                    <div className="text-sm text-gray-300 py-2">30</div>
                    <div className="text-sm text-gray-300 py-2">1</div>
                    <div className="text-sm text-gray-300 py-2">2</div>
                    <div className="text-sm text-gray-300 py-2">3</div>
                    <div className="text-sm text-gray-300 py-2">4</div>
                    <div className="text-sm text-gray-300 py-2">5</div>
                    
                    <div className="text-sm text-gray-300 py-2">6</div>
                    <div className="text-sm text-gray-300 py-2">7</div>
                    <div className="text-sm text-gray-300 py-2">8</div>
                    <div className="text-sm text-gray-300 py-2">9</div>
                    <div className="text-sm text-gray-300 py-2">10</div>
                    <div className="text-sm text-gray-300 py-2">11</div>
                    <div className="text-sm text-gray-300 py-2">12</div>
                    
                    <div className="text-sm text-gray-300 py-2">13</div>
                    <div className="text-sm text-gray-300 py-2">14</div>
                    <div className="text-sm text-gray-300 py-2">15</div>
                    <div className="text-sm text-gray-300 py-2">16</div>
                    <div className="text-sm text-gray-300 py-2">17</div>
                    <div className="text-sm text-gray-300 py-2">18</div>
                    <div className="text-sm text-gray-300 py-2">19</div>
                    
                    <div className="text-sm text-gray-300 py-2">20</div>
                    <div className="text-sm text-gray-300 py-2">21</div>
                    <div className="text-sm text-gray-300 py-2">22</div>
                    <div className="text-sm text-gray-300 py-2">23</div>
                    <div className="text-sm text-gray-300 py-2">24</div>
                    <div className="text-sm text-gray-300 py-2">25</div>
                    <div className="text-sm text-gray-300 py-2">26</div>
                    
                    <div className="text-sm text-gray-300 py-2">27</div>
                    <div className="text-sm text-gray-300 py-2">28</div>
                    <div className="text-sm text-gray-300 py-2">29</div>
                    <div className="text-sm text-gray-300 py-2">30</div>
                    <div className="text-sm text-gray-300 py-2">31</div>
                    <div className="text-sm text-gray-300 py-2">1</div>
                    <div className="text-sm text-gray-300 py-2">2</div>
                </div>
              </div>
            </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setShowDateModal(false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear dates
            </button>
                <button 
                  onClick={() => setShowDateModal(false)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                >
                  Close
                </button>
          </div>
      </div>
    </div>
        </div>
      )}

      {/* Time Selection Modal */}
      {showTimeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Select time</h2>
                <button 
                  onClick={() => setShowTimeModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">Choose your preferred time slot</p>
              
              {/* Time options */}
              <div className="space-y-2">
                {['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTime(time);
                      setShowTimeModal(false);
                    }}
                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{time}</div>
                    <div className="text-sm text-gray-500">Available</div>
                  </button>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setShowTimeModal(false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowTimeModal(false)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
