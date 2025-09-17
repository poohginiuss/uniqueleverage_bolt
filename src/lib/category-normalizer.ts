/**
 * Centralized Category Normalizer
 * 
 * This module provides consistent category mapping between:
 * - Raw CSV data values
 * - Display names in UI
 * - Filtering logic
 * 
 * All category operations should go through this module to prevent mismatches.
 */

export interface CategoryMapping {
  rawValue: string;
  displayName: string;
  keywords: string[];
}

// Centralized category definitions
export const CATEGORY_MAPPINGS: CategoryMapping[] = [
  {
    rawValue: 'TRUCK',
    displayName: 'Trucks',
    keywords: ['truck', 'pickup', 'pick-up', 'pick_up']
  },
  {
    rawValue: 'SUV',
    displayName: 'Sport Utility',
    keywords: ['suv', 'sport utility', 'sport-utility', 'sport_utility', 'crossover', 'cuv']
  },
  {
    rawValue: 'SEDAN',
    displayName: 'Sedan',
    keywords: ['sedan', 'saloon']
  },
  {
    rawValue: 'HATCHBACK',
    displayName: 'Hatchbacks',
    keywords: ['hatchback', 'hatch-back', 'hatch_back']
  },
  {
    rawValue: 'COUPE',
    displayName: 'Coupe',
    keywords: ['coupe', 'coupé']
  },
  {
    rawValue: 'MOTORCYCLE',
    displayName: 'Motorcycle',
    keywords: ['motorcycle', 'bike', 'motor-bike', 'motor_bike']
  },
  {
    rawValue: 'BOAT',
    displayName: 'Boats',
    keywords: ['boat', 'watercraft']
  },
  {
    rawValue: 'TRAILER',
    displayName: 'Trailers',
    keywords: ['trailer', 'tow']
  },
  {
    rawValue: 'SIDE-BY-SIDE',
    displayName: 'Side-by-Side',
    keywords: ['side-by-side', 'side_by_side', 'side by side', 'atv', 'utv']
  },
  {
    rawValue: 'OTHER',
    displayName: 'Other',
    keywords: ['other', 'misc', 'miscellaneous']
  }
];

/**
 * Normalize a raw category value to a standardized format
 * @param rawValue - The raw value from CSV/data source
 * @returns Normalized category value
 */
export function normalizeCategory(rawValue: string): string {
  if (!rawValue) return 'OTHER';
  
  const normalized = rawValue.trim().toUpperCase();
  
  // Find exact match first
  const exactMatch = CATEGORY_MAPPINGS.find(mapping => 
    mapping.rawValue === normalized
  );
  if (exactMatch) return exactMatch.rawValue;
  
  // Find keyword match
  const keywordMatch = CATEGORY_MAPPINGS.find(mapping =>
    mapping.keywords.some(keyword => 
      normalized.includes(keyword.toUpperCase())
    )
  );
  if (keywordMatch) return keywordMatch.rawValue;
  
  return 'OTHER';
}

/**
 * Get display name for a raw category value
 * @param rawValue - The raw value from CSV/data source
 * @returns Display name for UI
 */
export function getDisplayName(rawValue: string): string {
  const normalized = normalizeCategory(rawValue);
  const mapping = CATEGORY_MAPPINGS.find(m => m.rawValue === normalized);
  return mapping?.displayName || 'Other';
}

/**
 * Get raw value from display name (for filtering)
 * @param displayName - The display name from UI
 * @returns Raw value for filtering
 */
export function getRawValueFromDisplayName(displayName: string): string {
  const mapping = CATEGORY_MAPPINGS.find(m => 
    m.displayName.toLowerCase() === displayName.toLowerCase()
  );
  return mapping?.rawValue || 'OTHER';
}

/**
 * Get all available categories with their counts
 * @param vehicles - Array of vehicles
 * @returns Array of categories with counts
 */
export function getCategoryStats(vehicles: any[]): Array<{name: string, count: number}> {
  const categoryCounts = new Map<string, number>();
  
  vehicles.forEach(vehicle => {
    const normalizedCategory = normalizeCategory(vehicle.bodyStyle || vehicle.Body_style || '');
    categoryCounts.set(normalizedCategory, (categoryCounts.get(normalizedCategory) || 0) + 1);
  });
  
  return Array.from(categoryCounts.entries())
    .map(([rawValue, count]) => ({
      name: getDisplayName(rawValue),
      count
    }))
    .filter(cat => cat.count > 0)
    .sort((a, b) => b.count - a.count);
}

/**
 * Filter vehicles by category display name
 * @param vehicles - Array of vehicles
 * @param displayName - Display name to filter by
 * @returns Filtered vehicles
 */
export function filterVehiclesByCategory(vehicles: any[], displayName: string): any[] {
  if (displayName === 'All' || displayName === 'all') return vehicles;
  
  const rawValue = getRawValueFromDisplayName(displayName);
  
  return vehicles.filter(vehicle => {
    const vehicleCategory = normalizeCategory(vehicle.bodyStyle || vehicle.Body_style || '');
    return vehicleCategory === rawValue;
  });
}
