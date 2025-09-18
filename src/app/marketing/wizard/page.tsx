"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
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

            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="mx-auto max-w-4xl">
                    <MarketingWizard />
                </div>
            </div>
        </main>
    );
}

const MarketingWizard = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [promotionType, setPromotionType] = useState<'single' | 'set' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [selectedSet, setSelectedSet] = useState<any>(null);
  const [destination, setDestination] = useState<'vsp' | 'messenger' | ''>('');
  const [headline, setHeadline] = useState('');
  const [primaryText, setPrimaryText] = useState('');
  const [callToAction, setCallToAction] = useState('Shop Now');
  const [budget, setBudget] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableSets, setAvailableSets] = useState<any[]>([]);
  const [budgetError, setBudgetError] = useState('');
  const [showCreateSet, setShowCreateSet] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [selectedVehiclesForSet, setSelectedVehiclesForSet] = useState<Vehicle[]>([]);
  const [setCreationMethod, setSetCreationMethod] = useState<'criteria' | 'manual'>('criteria');
  const [savedSets, setSavedSets] = useState<Array<{id: string, name: string, filters: Array<{id: string, attribute: string, condition: string, value: string | string[]}>, filterLogic: 'all' | 'any'}>>([]);
  const [selectedSavedSet, setSelectedSavedSet] = useState<string>('');
  const [showSaveSetOption, setShowSaveSetOption] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [setCriteria, setSetCriteria] = useState({
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    makes: [] as string[],
    bodyStyles: [] as string[],
    mileageMax: ''
  });
  const [filterLogic, setFilterLogic] = useState<'all' | 'any'>('all');
  const [filters, setFilters] = useState<Array<{
    id: string;
    attribute: string;
    condition: string;
    value: string | string[];
  }>>([]);

  // Debounced search
  const MIN_SEARCH_LENGTH = 2;
  const DEBOUNCE_DELAY = 300;

  // Evaluation functions for filtering
  const evaluateStringCondition = (vehicleValue: string, condition: string, filterValue: string | string[]) => {
    if (!filterValue || filterValue === '') return true;
    
    const values = Array.isArray(filterValue) ? filterValue : [filterValue];
    const vehicleVal = vehicleValue.toLowerCase();
    
    switch (condition) {
      case 'is':
        return values.some(v => vehicleVal === v.toLowerCase());
      case 'is_not':
        return !values.some(v => vehicleVal === v.toLowerCase());
      case 'is_any_of':
        return values.some(v => vehicleVal === v.toLowerCase());
      case 'is_not_any_of':
        return !values.some(v => vehicleVal === v.toLowerCase());
      case 'contains':
        return values.some(v => vehicleVal.includes(v.toLowerCase()));
      case 'not_contains':
        return !values.some(v => vehicleVal.includes(v.toLowerCase()));
      case 'starts_with':
        return values.some(v => vehicleVal.startsWith(v.toLowerCase()));
      case 'ends_with':
        return values.some(v => vehicleVal.endsWith(v.toLowerCase()));
      default:
        return true;
    }
  };

  const evaluateNumberCondition = (vehicleValue: number, condition: string, filterValue: string | string[]) => {
    if (!filterValue || filterValue === '') return true;
    
    const numValue = typeof filterValue === 'string' ? parseFloat(filterValue) : parseFloat(filterValue[0]);
    if (isNaN(numValue)) return true;
    
    const numValue2 = Array.isArray(filterValue) && filterValue.length > 1 ? parseFloat(filterValue[1]) : null;
    
    switch (condition) {
      case 'equals':
        return vehicleValue === numValue;
      case 'not_equals':
        return vehicleValue !== numValue;
      case 'greater_than':
        return vehicleValue > numValue;
      case 'less_than':
        return vehicleValue < numValue;
      case 'between':
        return numValue2 !== null ? vehicleValue >= numValue && vehicleValue <= numValue2 : true;
      default:
        return true;
    }
  };

  // Memoize filtered vehicles to ensure re-rendering
  const filteredVehicles = useMemo(() => {
    if (filters.length === 0) return vehicles;
    if (vehicles.length === 0) return [];
    
    return vehicles.filter(vehicle => {
      const results = filters.map(filter => {
        const attribute = filter.attribute;
        const condition = filter.condition;
        const value = filter.value;
        
        switch (attribute) {
          case 'make':
            return evaluateStringCondition(vehicle.make, condition, value);
          case 'model':
            return evaluateStringCondition(vehicle.model, condition, value);
          case 'trim':
            return evaluateStringCondition(vehicle.trim || 'Unknown', condition, value);
          case 'year':
            return evaluateNumberCondition(vehicle.year, condition, value);
          case 'bodyStyle':
            return evaluateStringCondition(vehicle.bodyStyle, condition, value);
          case 'price':
            return evaluateNumberCondition(vehicle.price, condition, value);
          case 'mileage':
            return evaluateNumberCondition(vehicle.mileage.value, condition, value);
          case 'fuelType':
            return evaluateStringCondition(vehicle.fuelType || 'Unknown', condition, value);
          case 'transmission':
            return evaluateStringCondition(vehicle.transmission || 'Unknown', condition, value);
          case 'drivetrain':
            return evaluateStringCondition(vehicle.drivetrain || 'Unknown', condition, value);
          case 'exteriorColor':
            return evaluateStringCondition(vehicle.exteriorColor || 'Unknown', condition, value);
          case 'interiorColor':
            return evaluateStringCondition(vehicle.interiorColor || 'Unknown', condition, value);
          case 'condition':
            return evaluateStringCondition(vehicle.condition || 'Unknown', condition, value);
          case 'vehicleType':
            return evaluateStringCondition(vehicle.vehicleType || 'Unknown', condition, value);
          case 'dealerName':
            return evaluateStringCondition(vehicle.dealerName || 'Unknown', condition, value);
          default:
            return true;
        }
      });
      
      return filterLogic === 'all' ? results.every(r => r) : results.some(r => r);
    });
  }, [filters, filterLogic, vehicles]);


  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= MIN_SEARCH_LENGTH) {
        setDebouncedSearchQuery(searchQuery);
        setIsSearching(false); // No spinner for instant client-side filtering
      } else {
        setDebouncedSearchQuery('');
        setIsSearching(false);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load vehicle data
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        const vehicleData = await fetchVehicleData();
        setVehicles(vehicleData);
        
        // Calculate actual vehicle counts for each body style that exists in the data
        const calculateSetCounts = (vehicles: Vehicle[]) => {
          // Get all unique body styles from the actual data
          const bodyStyles = [...new Set(vehicles.map(v => v.bodyStyle))].filter(Boolean);
          
          // Create collections based on actual body styles in the data
          const collections = bodyStyles.map((bodyStyle, index) => {
            const count = vehicles.filter(v => v.bodyStyle === bodyStyle).length;
            return {
              id: index + 1,
              name: bodyStyle,
              count: count,
              description: `${count} vehicles`,
              bodyStyle: bodyStyle
            };
          });
          
          // Sort by count (highest first) and only show collections with vehicles
          return collections.filter(c => c.count > 0).sort((a, b) => b.count - a.count);
        };
        
        setAvailableSets(calculateSetCounts(vehicleData));
      } catch (error) {
        console.error('Error loading vehicles:', error);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };
    
    loadVehicles();
  }, []);

  // Filter vehicles based on search
  const searchFilteredVehicles = vehicles.filter(vehicle => {
    if (!debouncedSearchQuery) return false;
    
    const searchTerm = debouncedSearchQuery.toLowerCase();
    return (
      vehicle.make.toLowerCase().includes(searchTerm) ||
      vehicle.model.toLowerCase().includes(searchTerm) ||
      vehicle.year.toString().includes(searchTerm) ||
      vehicle.bodyStyle.toLowerCase().includes(searchTerm)
    );
  });

  // Budget validation
  const validateBudget = () => {
    if (!budget || !selectedDuration) {
      setBudgetError('');
      return;
    }

    const budgetAmount = parseFloat(budget);
    let minimumRequired = 20;

    if (selectedDuration === '3months') {
      minimumRequired = 100;
    } else if (selectedDuration === '30days') {
      minimumRequired = 50;
    } else if (selectedDuration === 'custom' && customStartDate && customEndDate) {
      const days = Math.ceil((new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / (1000 * 60 * 60 * 24));
      minimumRequired = days * 4;
    }

    if (budgetAmount < minimumRequired) {
      setBudgetError(`Minimum budget required: $${minimumRequired}`);
    } else {
      setBudgetError('');
    }
  };

  // Validate budget when budget or duration changes
  useEffect(() => {
    validateBudget();
  }, [budget, selectedDuration, customStartDate, customEndDate]);

  // Handlers
  const handlePromotionTypeChange = (type: 'single' | 'set') => {
    setPromotionType(type);
    setSelectedVehicles([]);
    setSelectedSet(null);
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    if (promotionType === 'single') {
      setSelectedVehicles([vehicle]);
    }
  };

  const handleSetSelect = (set: any) => {
    setSelectedSet(set);
    // Filter vehicles by the body style of the selected set
    const setVehicles = vehicles.filter(v => v.bodyStyle === set.bodyStyle);
    setSelectedVehicles(setVehicles);
  };

  const handleCreateSet = () => {
    if (newSetName.trim() && selectedVehiclesForSet.length > 0) {
      const newSet = {
        id: Date.now(), // Simple ID generation
        name: newSetName.trim(),
        count: selectedVehiclesForSet.length,
        description: 'Custom vehicle collection',
        vehicles: selectedVehiclesForSet
      };
      
      setAvailableSets(prev => [...prev, newSet]);
      setSelectedSet(newSet);
      setSelectedVehicles([]);
      setShowCreateSet(false);
      setNewSetName('');
      setSelectedVehiclesForSet([]);
      setSelectedSavedSet('');
      setShowSaveSetOption(false);
      setCurrentStep(2);
    }
  };

  const handleVehicleToggleForSet = (vehicle: Vehicle) => {
    setSelectedVehiclesForSet(prev => {
      const isSelected = prev.some(v => v.id === vehicle.id);
      if (isSelected) {
        return prev.filter(v => v.id !== vehicle.id);
      } else {
        return [...prev, vehicle];
      }
    });
  };

  // Automotive-specific attributes and conditions
  const vehicleAttributes = [
    { value: 'make', label: 'Make' },
    { value: 'model', label: 'Model' },
    { value: 'trim', label: 'Trim' },
    { value: 'year', label: 'Year' },
    { value: 'bodyStyle', label: 'Body Style' },
    { value: 'price', label: 'Price' },
    { value: 'mileage', label: 'Mileage' },
    { value: 'fuelType', label: 'Fuel Type' },
    { value: 'transmission', label: 'Transmission' },
    { value: 'drivetrain', label: 'Drivetrain' },
    { value: 'exteriorColor', label: 'Exterior Color' },
    { value: 'interiorColor', label: 'Interior Color' },
    { value: 'condition', label: 'Condition' },
    { value: 'vehicleType', label: 'Vehicle Type' },
    { value: 'dealerName', label: 'Dealer Name' }
  ];

  const getConditionsForAttribute = (attribute: string) => {
    switch (attribute) {
      case 'make':
      case 'model':
      case 'trim':
      case 'bodyStyle':
      case 'fuelType':
      case 'transmission':
      case 'drivetrain':
      case 'exteriorColor':
      case 'interiorColor':
      case 'condition':
      case 'vehicleType':
      case 'dealerName':
        return [
          { value: 'contains', label: 'contains' },
          { value: 'starts_with', label: 'starts with' },
          { value: 'ends_with', label: 'ends with' },
          { value: 'is', label: 'is exactly' },
          { value: 'is_not', label: 'is not' },
          { value: 'not_contains', label: 'does not contain' }
        ];
      case 'year':
      case 'price':
      case 'mileage':
        return [
          { value: 'equals', label: 'equals' },
          { value: 'not_equals', label: 'does not equal' },
          { value: 'greater_than', label: 'is greater than' },
          { value: 'less_than', label: 'is less than' },
          { value: 'between', label: 'is between' }
        ];
      default:
        return [{ value: 'equals', label: 'equals' }];
    }
  };

  const getValueOptionsForAttribute = (attribute: string) => {
    const uniqueValues = [...new Set(vehicles.map(v => {
      switch (attribute) {
        case 'make': return v.make;
        case 'model': return v.model;
        case 'bodyStyle': return v.bodyStyle;
        case 'fuelType': return v.fuelType;
        case 'transmission': return v.transmission;
        case 'drivetrain': return v.drivetrain;
        case 'exteriorColor': return v.exteriorColor;
        case 'interiorColor': return v.interiorColor;
        case 'condition': return v.condition;
        case 'vehicleType': return v.vehicleType;
        case 'dealerName': return v.dealerName;
        default: return '';
      }
    }).filter(Boolean))].sort();
    
    return uniqueValues.map(value => ({ value, label: value }));
  };



  const addFilter = () => {
    const newFilter = {
      id: Date.now().toString(),
      attribute: 'make',
      condition: 'is',
      value: ''
    };
    setFilters(prev => [...prev, newFilter]);
  };

  const updateFilter = (filterId: string, field: string, value: string | string[]) => {
    setFilters(prev => prev.map(filter => 
      filter.id === filterId 
        ? { ...filter, [field]: value }
        : filter
    ));
  };

  const removeFilter = (filterId: string) => {
    setFilters(prev => prev.filter(filter => filter.id !== filterId));
  };

  const getUniqueValuesForAttribute = (attribute: string) => {
    const values = vehicles.map(vehicle => {
      switch (attribute) {
        case 'make': return vehicle.make;
        case 'model': return vehicle.model;
        case 'trim': return vehicle.trim || 'Unknown';
        case 'bodyStyle': return vehicle.bodyStyle;
        case 'fuelType': return vehicle.fuelType || 'Unknown';
        case 'transmission': return vehicle.transmission || 'Unknown';
        case 'drivetrain': return vehicle.drivetrain || 'Unknown';
        case 'exteriorColor': return vehicle.exteriorColor || 'Unknown';
        case 'interiorColor': return vehicle.interiorColor || 'Unknown';
        case 'condition': return vehicle.condition || 'Unknown';
        case 'vehicleType': return vehicle.vehicleType || 'Unknown';
        case 'dealerName': return vehicle.dealerName || 'Unknown';
        default: return '';
      }
    }).filter(value => value && value !== 'Unknown');
    
    return [...new Set(values)].sort();
  };

  const handleCreateSetFromFilters = () => {
    if (newSetName.trim()) {
      const matchingVehicles = filteredVehicles;
      const newSet = {
        id: Date.now(),
        name: newSetName.trim(),
        count: matchingVehicles.length,
        description: 'Custom vehicle collection',
        vehicles: matchingVehicles,
        filters: filters,
        filterLogic: filterLogic
      };
      
      setAvailableSets(prev => [...prev, newSet]);
      setSelectedSet(newSet);
    setSelectedVehicles([]);
      setShowCreateSet(false);
      setNewSetName('');
      setFilters([]);
      setFilterLogic('all');
      setSelectedSavedSet('');
      setShowSaveSetOption(false);
      
      // Save to saved sets if checkbox is checked
      if (showSaveSetOption) {
        const savedSet = {
          id: `saved_${Date.now()}`,
          name: newSetName.trim(),
          filters: filters.map(filter => ({
            ...filter,
            id: `filter_${Date.now()}_${Math.random()}`
          })),
          filterLogic: filterLogic
        };
        setSavedSets(prev => [...prev, savedSet]);
        setShowSaveConfirmation(true);
        // Hide confirmation after 3 seconds
        setTimeout(() => setShowSaveConfirmation(false), 3000);
      }
      
      setCurrentStep(2);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const renderProgressBar = () => (
    <div className="mt-6">
      <div className="flex items-center justify-between max-w-lg">
        {[1, 2, 3, 4, 5].map((step, index) => (
          <React.Fragment key={step}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep > step ? 'bg-green-500 text-white' : currentStep === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {currentStep > step ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step
              )}
            </div>
            {index < 4 && (
              <div className={`flex-1 h-1 mx-1 ${
                currentStep > step ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="mb-8">
      {/* Back Button - Only show when there's somewhere to go back to */}
      {(promotionType || selectedVehicles.length > 0 || selectedSet || showCreateSet) && (
        <div className="mb-4">
          <button 
            onClick={() => {
              if (showCreateSet) {
                // Go back to vehicle set selection
                setShowCreateSet(false);
                setNewSetName('');
                setSelectedVehiclesForSet([]);
                setSetCreationMethod('criteria');
                setFilters([]);
                setFilterLogic('all');
                setSelectedSavedSet('');
                setShowSaveSetOption(false);
              } else if (selectedVehicles.length > 0 || selectedSet) {
                // Go back to promotion type selection
                setSelectedVehicles([]);
                setSelectedSet(null);
                setPromotionType(null);
              } else if (promotionType) {
                // Go back to initial state
                setPromotionType(null);
              }
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back</span>
          </button>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {selectedVehicles.length > 0 
            ? selectedVehicles.length === 1 
              ? 'Vehicle Selected' 
              : `${selectedSet?.name || 'Vehicle Collection'} Selected`
            : promotionType === 'set' && showCreateSet ? 'Build Your Collection' : 'Select Vehicle'}
        </h2>
        <p className="text-sm text-gray-500">
          {selectedVehicles.length > 0 
            ? selectedVehicles.length === 1
              ? 'Your selected vehicle is shown below'
              : `${selectedVehicles.length} vehicles from ${selectedSet?.name || 'your collection'} are included in your campaign`
            : promotionType === 'single' 
              ? 'Search and select the specific vehicle you want to promote'
              : promotionType === 'set' && showCreateSet
                ? 'Set filters to automatically include matching vehicles'
                : promotionType === 'set'
                  ? 'Choose from your pre-configured vehicle collections'
                  : 'First, choose how you want to promote your vehicles'
          }
        </p>
      </div>
        
      {/* Promotion Type Selection */}
      {promotionType === null && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <button 
              onClick={() => handlePromotionTypeChange('single')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                promotionType === 'single'
                  ? 'bg-blue-50 border-blue-500 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  promotionType === 'single' ? 'bg-blue-600' : 'bg-gray-100'
                }`}>
                  <svg className={`w-5 h-5 ${promotionType === 'single' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-semibold text-lg ${
                    promotionType === 'single' ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    Single Vehicle
                  </h3>
                  <p className={`text-sm mt-1 ${
                    promotionType === 'single' ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    Promote one specific vehicle
                  </p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => handlePromotionTypeChange('set')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                promotionType === 'set'
                  ? 'bg-blue-50 border-blue-500 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  promotionType === 'set' ? 'bg-blue-600' : 'bg-gray-100'
                }`}>
                  <svg className={`w-5 h-5 ${promotionType === 'set' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-semibold text-lg ${
                    promotionType === 'set' ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    Vehicle Set
                  </h3>
                  <p className={`text-sm mt-1 ${
                    promotionType === 'set' ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    Promote a collection of vehicles
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}


      {/* Vehicle Search - Only show when no vehicle is selected */}
        {promotionType === 'single' && selectedVehicles.length === 0 && (
          <div className="mb-6">
            <div className="relative">
              <input 
                type="text" 
              placeholder="Search by year, make, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 text-base border border-gray-200 rounded-lg focus:outline-none bg-white"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          
          {/* Vehicle Count */}
          <div className="mt-2 text-sm text-gray-500">
            {vehicles.length > 0 ? (
              <span>
                {debouncedSearchQuery ? (
                  <>
                    {searchFilteredVehicles.length.toLocaleString()} of {vehicles.length.toLocaleString()} vehicles
                  </>
                ) : (
                  <>
                    {vehicles.length.toLocaleString()} vehicles available in catalog
                  </>
                )}
                </span>
            ) : (
              <span>Loading vehicle catalog...</span>
              )}
            </div>
          </div>
        )}

      {/* Vehicle Selection Grid */}
        {promotionType === 'single' && debouncedSearchQuery && selectedVehicles.length === 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select Vehicle</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchFilteredVehicles.map((vehicle) => (
                <div 
                  key={vehicle.id} 
                className="group relative border rounded-lg p-3 cursor-pointer transition-all duration-200 border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
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
                          {selectedVehicles.some(v => v.id === vehicle.id) && (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Vehicle Sets - Only show when no set is selected */}
      {promotionType === 'set' && !selectedSet && (
          <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {showCreateSet ? 'Filter Criteria' : 'Select vehicle collection'}
          </h3>
          
          {/* Existing Sets - Hide when creating custom set */}
          {!showCreateSet && (
            <div className="mb-4">
              <div className="space-y-2">
                {availableSets.map((set) => (
                  <button
                    key={set.id}
                    onClick={() => handleSetSelect(set)}
                    className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {set.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {set.count} vehicles • {set.description}
                        </p>
              </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
              ))}
            </div>
          </div>
        )}

          {/* Create Custom Set Option - Hide when already creating custom set */}
          {!showCreateSet && (
            <>
              <div className="text-center">
                <span className="text-sm text-gray-500">or</span>
              </div>
              
              <button 
                onClick={() => setShowCreateSet(true)}
                className="w-full mt-3 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Build Custom Collection
                </div>
              </button>
            </>
          )}

          {/* Custom Set Creation */}
          {showCreateSet && (
            <div className="mt-4 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Set Up Filters</h4>
              
              {/* Set Name and Description */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Set Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 'My Luxury Fleet', 'Budget Cars Under $25k'"
                    value={newSetName}
                    onChange={(e) => setNewSetName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Use Saved Set (Optional)</label>
              <select 
                    value={selectedSavedSet}
                onChange={(e) => {
                      setSelectedSavedSet(e.target.value);
                      if (e.target.value) {
                        const savedSet = savedSets.find(set => set.id === e.target.value);
                        if (savedSet) {
                          setFilters(savedSet.filters);
                          setFilterLogic(savedSet.filterLogic);
                        }
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-0 focus:border-gray-200"
                  >
                    <option value="">Start fresh or select a saved set</option>
                    {savedSets.map((set) => (
                      <option key={set.id} value={set.id}>{set.name}</option>
                ))}
              </select>
          </div>
              </div>

              {/* Creation Method Selection */}
          <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-700 mb-3">How do you want to create this set?</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => setSetCreationMethod('criteria')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      setCreationMethod === 'criteria'
                        ? 'bg-blue-50 border-blue-500 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        setCreationMethod === 'criteria' ? 'bg-blue-600' : 'bg-gray-100'
                      }`}>
                        <svg className={`w-5 h-5 ${setCreationMethod === 'criteria' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </div>
                      <div>
                        <h3 className={`font-semibold text-lg ${
                          setCreationMethod === 'criteria' ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          Use Criteria
                  </h3>
                        <p className={`text-sm mt-1 ${
                          setCreationMethod === 'criteria' ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          Filter vehicles by price, year, make, etc.
                        </p>
                </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSetCreationMethod('manual')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      setCreationMethod === 'manual'
                        ? 'bg-blue-50 border-blue-500 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                      <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        setCreationMethod === 'manual' ? 'bg-blue-600' : 'bg-gray-100'
                      }`}>
                        <svg className={`w-5 h-5 ${setCreationMethod === 'manual' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <h3 className={`font-semibold text-lg ${
                          setCreationMethod === 'manual' ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          Select Manually
                        </h3>
                        <p className={`text-sm mt-1 ${
                          setCreationMethod === 'manual' ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          Choose specific vehicles one by one
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Advanced Filter Creation */}
              {setCreationMethod === 'criteria' && (
                <div className="space-y-4 mb-6">
                  <h5 className="text-sm font-medium text-gray-700">Set your criteria</h5>
                  
                  {/* Filter Logic */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicles must match:</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="filterLogic"
                          value="all"
                          checked={filterLogic === 'all'}
                          onChange={(e) => setFilterLogic(e.target.value as 'all' | 'any')}
                          className="w-4 h-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">all filters</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="filterLogic"
                          value="any"
                          checked={filterLogic === 'any'}
                          onChange={(e) => setFilterLogic(e.target.value as 'all' | 'any')}
                          className="w-4 h-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">at least one filter</span>
                      </label>
                    </div>
                  </div>

                  {/* Filters Table */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-3 text-xs font-medium text-gray-600 uppercase tracking-wide">
                      <div className="col-span-3 flex items-center gap-1">
                        Attribute
                        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="col-span-3 flex items-center gap-1">
                        Condition
                        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="col-span-5 flex items-center gap-1">
                        Value
                        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="col-span-1"></div>
                    </div>

                    {filters.map((filter) => (
                      <div key={filter.id} className="grid grid-cols-12 gap-3 items-center">
                        {/* Attribute */}
                        <div className="col-span-3">
                          <div className="relative">
                            <select 
                              value={filter.attribute}
                              onChange={(e) => {
                                const newAttribute = e.target.value;
                                const defaultCondition = getConditionsForAttribute(newAttribute)[0].value;
                                updateFilter(filter.id, 'attribute', newAttribute);
                                updateFilter(filter.id, 'condition', defaultCondition);
                                updateFilter(filter.id, 'value', '');
                              }}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-gray-200"
                            >
                              {vehicleAttributes.map(attr => (
                                <option key={attr.value} value={attr.value}>{attr.label}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Condition */}
                        <div className="col-span-3">
                          <div className="relative">
                            <select
                              value={filter.condition}
                              onChange={(e) => updateFilter(filter.id, 'condition', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-gray-200"
                            >
                              {getConditionsForAttribute(filter.attribute).map(condition => (
                                <option key={condition.value} value={condition.value}>{condition.label}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Value */}
                        <div className="col-span-5">
                          {['make', 'model', 'trim', 'bodyStyle', 'fuelType', 'transmission', 'drivetrain', 'exteriorColor', 'interiorColor', 'condition', 'vehicleType', 'dealerName'].includes(filter.attribute) ? (
                            // Smart value field: dropdown for exact matches, text input for partial matches
                            ['is', 'is_not'].includes(filter.condition) ? (
                              <div className="relative">
                                <select
                                  value={Array.isArray(filter.value) ? filter.value[0] : filter.value}
                                  onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-gray-200"
                                >
                                  <option value="">Select {vehicleAttributes.find(a => a.value === filter.attribute)?.label.toLowerCase()}</option>
                                  {getValueOptionsForAttribute(filter.attribute).map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                  ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                            ) : (
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder={`Add ${vehicleAttributes.find(a => a.value === filter.attribute)?.label.toLowerCase()}`}
                                  value={Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}
                                  onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                                  className="w-full px-3 py-2 pl-8 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-gray-200"
                                />
                                <svg className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </div>
                            )
                          ) : ['year', 'price', 'mileage'].includes(filter.attribute) ? (
                            <input
                              type="number"
                              placeholder={filter.attribute === 'year' ? '2020' : filter.attribute === 'price' ? '$25000' : '50000'}
                              value={Array.isArray(filter.value) ? filter.value[0] : filter.value}
                              onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-gray-200"
                            />
                          ) : (
                            <input
                              type="text"
                              placeholder="Enter value"
                              value={Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}
                              onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-gray-200"
                            />
                          )}
                        </div>

                        {/* Remove Button */}
                        <div className="col-span-1">
                          <button
                            onClick={() => removeFilter(filter.id)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 rounded-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                          </button>
                  </div>
                </div>
                    ))}

                    {/* Add Filter Button */}
                    <button
                      onClick={addFilter}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {filters.length === 0 ? 'Add filter' : 'Add another filter'}
                    </button>
                  </div>

                  {/* Preview */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-800">
                      {filters.length === 0 ? (
                        <>
                          <span className="font-medium">Catalog:</span> {vehicles.length.toLocaleString()} vehicles available
                        </>
                      ) : (
                        <>
                          <span className="font-medium">Preview:</span> {filteredVehicles.length.toLocaleString()} of {vehicles.length.toLocaleString()} vehicles match your filters
                        </>
                      )}
                    </div>
                  </div>

                  {/* Filtered Vehicles Preview */}
                  {filters.length > 0 && filteredVehicles.length > 0 && (
                    <div className="mt-4">
                      <h6 className="text-sm font-medium text-gray-700 mb-3">
                        Matching Vehicles ({filteredVehicles.length})
                      </h6>
                      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                        {filteredVehicles.slice(0, 10).map((vehicle) => (
                          <div key={vehicle.id} className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {vehicle.images && vehicle.images.length > 0 ? (
                            <img 
                              src={vehicle.images[0]} 
                              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </div>
                              <div className="text-xs text-gray-500">
                                {vehicle.bodyStyle} • {vehicle.mileage.value.toLocaleString()} {vehicle.mileage.unit} • ${vehicle.price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                        {filteredVehicles.length > 10 && (
                          <div className="p-3 text-center text-sm text-gray-500 bg-gray-50">
                            ... and {filteredVehicles.length - 10} more vehicles
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {filters.length > 0 && filteredVehicles.length === 0 && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-sm text-red-800">
                        <span className="font-medium">No vehicles match your filters.</span> Try adjusting your criteria.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Manual Selection */}
              {setCreationMethod === 'manual' && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Select vehicles ({selectedVehiclesForSet.length} selected)
                  </h5>
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                    {vehicles.slice(0, 20).map((vehicle) => (
                      <div 
                        key={vehicle.id}
                        onClick={() => handleVehicleToggleForSet(vehicle)}
                        className={`flex items-center gap-3 p-2 cursor-pointer transition-colors ${
                          selectedVehiclesForSet.some(v => v.id === vehicle.id) 
                            ? 'bg-blue-50 border-l-4 border-blue-500' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                          {vehicle.images && vehicle.images.length > 0 ? (
                            <img 
                              src={vehicle.images[0]} 
                              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-xs text-gray-500">
                            ${vehicle.price.toLocaleString()}
                          </div>
                        </div>
                        {selectedVehiclesForSet.some(v => v.id === vehicle.id) && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                          </div>
                        )}
                        </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Set Option */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="saveSet"
                      checked={showSaveSetOption}
                      onChange={(e) => setShowSaveSetOption(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="saveSet" className="text-sm font-medium text-gray-700">
                      Save this set for future use
                    </label>
                  </div>
                </div>
                
                {/* Save Confirmation */}
                {showSaveConfirmation && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                      <span className="text-sm font-medium text-green-800">
                        Set "{newSetName}" saved successfully!
                            </span>
                          </div>
                  </div>
                )}
                        </div>
                        
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={setCreationMethod === 'criteria' ? handleCreateSetFromFilters : handleCreateSet}
                  disabled={
                    !newSetName.trim() || 
                    (setCreationMethod === 'criteria' ? 
                      filters.length === 0 || 
                      filters.some(filter => !filter.value || (typeof filter.value === 'string' && !filter.value.trim()))
                      : selectedVehiclesForSet.length === 0
                    )
                  }
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {setCreationMethod === 'criteria' 
                    ? `Create Set (${filteredVehicles.length} vehicles)`
                    : `Create Set (${selectedVehiclesForSet.length} vehicles)`
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Vehicle Card(s) */}
      {selectedVehicles.length > 0 && (
        <div className="mb-6">
          <div className="border border-green-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-white shadow-sm">
            {selectedVehicles.length === 1 ? (
              // Single vehicle display
              <div className="flex items-center gap-3">
                <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {selectedVehicles[0].images && selectedVehicles[0].images.length > 0 ? (
                    <img 
                      src={selectedVehicles[0].images[0]} 
                      alt={`${selectedVehicles[0].year} ${selectedVehicles[0].make} ${selectedVehicles[0].model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">
                    {selectedVehicles[0].year} {selectedVehicles[0].make} {selectedVehicles[0].model}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedVehicles[0].bodyStyle} • {selectedVehicles[0].mileage.value.toLocaleString()} {selectedVehicles[0].mileage.unit}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      ${selectedVehicles[0].price.toLocaleString()}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                  </div>
                </div>
              </div>
            ) : (
              // Multiple vehicles display (collection)
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">
                      {selectedSet?.name || 'Vehicle Collection'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedVehicles.length} vehicles selected
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Show all vehicles in the collection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                        {vehicle.images && vehicle.images.length > 0 ? (
                          <img 
                            src={vehicle.images[0]} 
                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${vehicle.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
                </div>
              </div>
            )}

      {/* Continue Button */}
        {(selectedVehicles.length > 0 || selectedSet) && (
        <div className="mt-6">
            <button 
            onClick={() => setCurrentStep(2)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {selectedVehicles.length > 0 
              ? `Continue with ${selectedVehicles.length} vehicle${selectedVehicles.length === 1 ? '' : 's'} from ${selectedSet?.name || 'selection'}`
              : 'Continue to Choose Destination'
            }
            </button>
          </div>
        )}
    </div>
  );

  const renderStep2 = () => (
    <div className="mb-8">
          <div className="mb-6">
        <button 
          onClick={() => goToStep(1)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mb-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back to Step 1</span>
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Destination</h2>
        <p className="text-sm text-gray-500">Where should customers go when they click your ad?</p>
      </div>

      {!destination ? (
            <div className="space-y-3">
          <button
            onClick={() => setDestination('vsp')}
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div>
                <div className="font-medium text-gray-900">Vehicle Scheduling Page</div>
                <div className="text-sm text-gray-500">Drive traffic to your inventory</div>
              </div>
            </div>
          </button>
          <button
            onClick={() => setDestination('messenger')}
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <div className="font-medium text-gray-900">Facebook Messenger</div>
                <div className="text-sm text-gray-500">Start conversations with customers</div>
              </div>
            </div>
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div>
                <div className="font-medium text-gray-900">
                  {destination === 'vsp' ? 'Vehicle Scheduling Page' : 'Facebook Messenger'}
                </div>
                <div className="text-sm text-gray-500">
                  {destination === 'vsp' ? 'Drive traffic to your inventory' : 'Start conversations with customers'}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setDestination('')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {destination && (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Destination URL</p>
              <p className="text-xs text-gray-500">Where your ad will direct customers</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Live URL</span>
            </div>
            <code className="text-sm text-gray-800 font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 block">
                  {destination === 'vsp' 
                    ? `uniqueleverage.com/inventory/all/stock/${selectedVehicles.length > 0 ? selectedVehicles[0].id : 'vehicle-id'}`
                    : 'facebook.com/messages/t/your-page-id'
                  }
                </code>
              </div>
            </div>
      )}

      {destination && (
        <div className="mt-6">
          <button
            onClick={() => setCurrentStep(3)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue to Customize Ad
          </button>
          </div>
        )}
    </div>
  );

  const renderStep3 = () => (
    <div className="mb-8">
          <div className="mb-6">
        <button 
          onClick={() => goToStep(2)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mb-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back to Step 2</span>
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Budget</h2>
        <p className="text-sm text-gray-500">Set your lifetime budget and campaign duration</p>
      </div>

      <div className="space-y-6">
              <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Duration</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button 
              onClick={() => {
                if (selectedDuration === '1week') {
                  setSelectedDuration('');
                  setBudget(''); // Clear budget when deselecting
                } else {
                  setSelectedDuration('1week');
                  setBudget(''); // Clear budget when changing duration
                }
                setShowCustomDatePicker(false);
              }}
              className={`p-3 border border-gray-200 rounded-lg transition-colors ${
                selectedDuration === '1week' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'hover:border-blue-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-900">5 Days</div>
              <div className="text-xs text-gray-500">Quick campaign</div>
            </button>
            <button 
              onClick={() => {
                if (selectedDuration === '30days') {
                  setSelectedDuration('');
                  setBudget(''); // Clear budget when deselecting
                } else {
                  setSelectedDuration('30days');
                  setBudget(''); // Clear budget when changing duration
                }
                setShowCustomDatePicker(false);
              }}
              className={`p-3 border border-gray-200 rounded-lg transition-colors ${
                selectedDuration === '30days' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'hover:border-blue-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-900">14 Days</div>
              <div className="text-xs text-gray-500">Standard campaign</div>
            </button>
            <button 
              onClick={() => {
                if (selectedDuration === '3months') {
                  setSelectedDuration('');
                  setBudget(''); // Clear budget when deselecting
                } else {
                  setSelectedDuration('3months');
                  setBudget(''); // Clear budget when changing duration
                }
                setShowCustomDatePicker(false);
              }}
              className={`p-3 border border-gray-200 rounded-lg transition-colors ${
                selectedDuration === '3months' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'hover:border-blue-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-900">30 Days</div>
              <div className="text-xs text-gray-500">Extended campaign</div>
            </button>
          </div>
          
          <div className="mt-4">
            <button 
              onClick={() => {
                if (selectedDuration === 'custom') {
                  setSelectedDuration('');
                  setBudget(''); // Clear budget when deselecting
                  setShowCustomDatePicker(false);
                } else {
                  setSelectedDuration('custom');
                  setBudget(''); // Clear budget when changing duration
                  setShowCustomDatePicker(true);
                }
              }}
              className={`w-full p-3 border rounded-lg transition-colors text-left ${
                selectedDuration === 'custom' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-900">Custom Duration</div>
              <div className="text-xs text-gray-500 mt-1">Set custom start and end dates (up to 90 days)</div>
            </button>
          </div>

          {/* Custom Date Picker */}
          {showCustomDatePicker && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Select Custom Dates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                  />
                </div>
              </div>
              {customStartDate && customEndDate && (
                <div className="mt-3 text-xs text-gray-600">
                  Duration: {Math.ceil((new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lifetime Budget <span className="text-red-500">*</span>
                </label>
                <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input 
              type="number" 
              placeholder={selectedDuration ? `${selectedDuration === '3months' ? '100' : selectedDuration === '30days' ? '50' : selectedDuration === 'custom' && customStartDate && customEndDate ? Math.ceil((new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / (1000 * 60 * 60 * 24)) * 4 : selectedDuration === 'custom' ? 'Select dates first' : '20'} minimum` : "Select duration first"}
              min={selectedDuration ? (selectedDuration === '3months' ? 100 : selectedDuration === '30days' ? 50 : selectedDuration === 'custom' && customStartDate && customEndDate ? Math.ceil((new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / (1000 * 60 * 60 * 24)) * 4 : 20) : undefined}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              disabled={!selectedDuration}
              className={`w-full pl-8 pr-3 py-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                !selectedDuration ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white'
              }`}
            />
                  </div>
          <p className="text-xs text-gray-500 mt-1">Total amount you want to spend on this campaign</p>
          {budgetError && (
            <p className="text-xs text-red-500 mt-1">{budgetError}</p>
          )}
          {selectedDuration === 'custom' && customStartDate && customEndDate && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Suggested Budget:</span> ${Math.ceil((new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / (1000 * 60 * 60 * 24)) * 10}
                </div>
              <div className="text-xs text-blue-600 mt-1">
                Based on {Math.ceil((new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / (1000 * 60 * 60 * 24))} days × $10/day
              </div>
            </div>
          )}
        </div>
              </div>

      {/* Continue Button - Only show when all fields are completed and no errors */}
      {budget && selectedDuration && (selectedDuration !== 'custom' || (customStartDate && customEndDate)) && !budgetError && (
        <div className="mt-6">
          <button
            onClick={() => setCurrentStep(4)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue to Audience Settings
          </button>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="mb-8">
      <div className="mb-6">
        <button 
          onClick={() => goToStep(3)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mb-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back to Step 3</span>
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Audience</h2>
        <p className="text-sm text-gray-500">Define who sees your ad</p>
      </div>

      <div className="space-y-6">
              <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
          <select className="w-full px-3 py-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
            <option value="broad">Broad Audience (25+ miles)</option>
            <option value="local">Local Area (10-25 miles)</option>
            <option value="custom">Custom Audience</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => setCurrentStep(5)}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Continue to Customize & Preview
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="mb-8">
      <div className="mb-6">
        <button 
          onClick={() => goToStep(4)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mb-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back to Step 4</span>
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Customize with Live Preview</h2>
        <p className="text-sm text-gray-500">Write your ad content and see it live</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Customization Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Headline <span className="text-red-500">*</span>
                </label>
            <input 
              type="text" 
              placeholder="Enter your ad headline..."
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Primary Text</label>
                <textarea 
              placeholder="Describe your vehicle or promotion..."
                  value={primaryText}
                  onChange={(e) => setPrimaryText(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors resize-none"
                />
              </div>

              <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Call to Action</label>
                <select 
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                >
                  <option value="Shop Now">Shop Now</option>
                  <option value="Learn More">Learn More</option>
                  <option value="Get Quote">Get Quote</option>
                  <option value="Schedule Test Drive">Schedule Test Drive</option>
              <option value="View Details">View Details</option>
                </select>
              </div>
            </div>

        {/* Right Side - Live Preview */}
        <div className="space-y-6">
                <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              {/* Facebook-style Ad Preview */}
              <div className="space-y-3">
                {/* Ad Header */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">UL</span>
                  </div>
                  <span>Unique Leverage</span>
                  <span>•</span>
                  <span>Sponsored</span>
                </div>
                
                {/* Vehicle Image */}
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  {selectedVehicles.length > 0 && selectedVehicles[0].images && selectedVehicles[0].images.length > 0 ? (
                    <img 
                      src={selectedVehicles[0].images[0]} 
                      alt={`${selectedVehicles[0].year} ${selectedVehicles[0].make} ${selectedVehicles[0].model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                      </svg>
                  </div>
                  )}
                </div>
                
                {/* Ad Content */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {headline || 'Your headline will appear here...'}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {primaryText || 'Your primary text will appear here...'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {selectedVehicles.length > 0 
                        ? `${selectedVehicles[0].year} ${selectedVehicles[0].make} ${selectedVehicles[0].model}`
                        : 'Vehicle name'
                      }
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      ${selectedVehicles.length > 0 ? selectedVehicles[0].price.toLocaleString() : 'Price'}
                    </span>
                </div>
              </div>
                
                {/* Call to Action Button */}
                <div className="pt-2">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium text-sm">
                    {callToAction}
                  </button>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-center">
            <button 
          onClick={() => {
            alert('Campaign launched successfully! Your ad is now live.');
          }}
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            Launch Campaign
              </div>
            </button>
          </div>
    </div>
  );

  return (
    <article className="min-w-0">
      <div className="mt-8">
        <h1 className="text-2xl font-semibold tracking-tight text-black">Ad Wizard</h1>
        <p className="mt-3 text-slate-600 leading-7 max-w-[70ch]">
          Create professional vehicle ads in 5 simple steps. Select your vehicle, choose your destination, customize your ad, set your budget, and launch your campaign.                                                                                                       
        </p>
    </div>
      <div className="h-px bg-slate-200 my-10 lg:my-12" />
      
      {/* Progress Indicator */}
      <div className="mb-8">
        {renderProgressBar()}
        </div>
      
      {/* Render only the current step */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
      {currentStep === 5 && renderStep5()}
    </article>
  );
};