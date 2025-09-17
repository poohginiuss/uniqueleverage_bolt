import { normalizeCategory, getDisplayName, getCategoryStats, filterVehiclesByCategory } from './category-normalizer';

export interface Vehicle {
  id: string;
  title: string;
  description: string;
  availability: string;
  condition: string;
  price: number;
  salePrice: number;
  url: string;
  dealerUrl: string;
  vin: string;
  transmission: string;
  bodyStyle: string;
  fuelType: string;
  vehicleType: string;
  drivetrain: string;
  daysOnLot: string;
  previousPrice: string;
  address: {
    addr1: string;
    addr2: string;
    addr3: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  stateOfVehicle: string;
  exteriorColor: string;
  interiorColor: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  dealerName: string;
  stockNumber: string;
  mileage: {
    value: number;
    unit: string;
  };
  images: string[];
}

export interface StyleStats {
  name: string;
  models: number;
  stock: number;
}

// Cache for the CSV data
let cachedData: Vehicle[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchVehicleData(): Promise<Vehicle[]> {
  console.log('fetchVehicleData called');
  
  // Return cached data if it's still fresh
  if (cachedData && Date.now() - lastFetchTime < CACHE_DURATION) {
    console.log('Returning cached data:', cachedData.length);
    return cachedData;
  }

  try {
    console.log('Fetching from API...');
    const response = await fetch('/api/vehicles', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('API response:', result.success ? 'SUCCESS' : 'ERROR');
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch vehicle data');
    }
    
    console.log('Parsing CSV data...');
    const vehicles = parseCSVData(result.data);
    console.log('Parsed vehicles:', vehicles.length);
    
    // Temporary: return mock data if parsing fails
    if (!vehicles || vehicles.length === 0) {
      console.log('CSV parsing failed, returning mock data');
      return generateMockVehicleData();
    }
    
    // Cache the data
    cachedData = vehicles;
    lastFetchTime = Date.now();
    
    return vehicles;
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    
    // Return cached data if available, even if stale
    if (cachedData) {
      return cachedData;
    }
    
    // Generate mock data as fallback
    return generateMockVehicleData();
  }
}

function parseCSVData(csvText: string): Vehicle[] {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const vehicles: Vehicle[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      const values = parseCSVLine(line);
      if (values.length < headers.length) continue;
      
      const vehicle: Vehicle = {
        id: values[1] || `vehicle-${i}`, // Vehicle_id
        title: values[2] || '', // Title
        description: values[3] || '', // Description
        availability: values[4] || '', // Availability
        condition: values[5] || '', // Condition
        price: parseFloat(values[6]) || 0, // Price
        salePrice: parseFloat(values[7]) || 0, // Sale_price
        url: values[8] || '', // Url
        dealerUrl: values[9] || '', // Dealer_url
        vin: values[10] || '', // Vin
        transmission: values[12] || '', // Transmission
        bodyStyle: normalizeCategory(values[13] || ''), // Body_style
        fuelType: values[14] || '', // Fuel_type
        vehicleType: values[15] || '', // Vehicle_type
        drivetrain: values[18] || '', // Drivetrain
        daysOnLot: values[19] || '', // Days_on_lot
        previousPrice: values[20] || '', // Previous_price
        address: {
          addr1: values[21] || '', // Address.addr1
          addr2: values[22] || '', // Address.addr2
          addr3: values[23] || '', // Address.addr3
          city: values[24] || '', // Address.city
          region: values[25] || '', // Address.region
          postalCode: values[26] || '', // Address.postal_code
          country: values[27] || '', // Address.country
        },
        stateOfVehicle: values[28] || '', // State_of_vehicle
        exteriorColor: values[29] || '', // Exterior_color
        interiorColor: values[30] || '', // Interior_color
        make: values[31] || '', // Make
        model: values[32] || '', // Model
        trim: values[33] || '', // Trim
        year: parseInt(values[34]) || 0, // Year
        dealerName: values[35] || '', // Dealer_name
        stockNumber: values[36] || '', // Stock_number
        mileage: {
          value: parseInt(values[37]) || 0, // Mileage.value
          unit: values[38] || 'MI', // Mileage.unit
        },
        images: [
          values[39], values[40], values[41], values[42], values[43], // Image[0-4].url
          values[44], values[45], values[46], values[47], values[48], // Image[5-9].url
          values[49], values[50], values[51], values[52], values[53], // Image[10-14].url
          values[54], values[55], values[56], values[57], values[58], // Image[15-19].url
        ].filter(url => url && url.trim() !== ''),
      };
      
      // Only add vehicles with valid data
      if (vehicle.make && vehicle.model && vehicle.year && vehicle.price > 0) {
        vehicles.push(vehicle);
      }
    } catch (error) {
      console.error(`Error parsing line ${i}:`, error);
      continue;
    }
  }
  
  return vehicles;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

export function getVehiclesByStyle(vehicles: Vehicle[], style: string): Vehicle[] {
  return filterVehiclesByCategory(vehicles, style);
}

export function getVehiclesByCondition(vehicles: Vehicle[], condition: string): Vehicle[] {
  if (condition === 'all') return vehicles;
  
  return vehicles.filter(vehicle => {
    const vehicleCondition = vehicle.condition?.toLowerCase();
    switch (condition.toLowerCase()) {
      case 'pre-owned':
        // All vehicles with conditions like VERY_GOOD, GOOD, FAIR, EXCELLENT are pre-owned
        return vehicleCondition === 'very_good' || vehicleCondition === 'good' || vehicleCondition === 'fair' || vehicleCondition === 'excellent';
      case 'new':
        return vehicleCondition === 'new';
      default:
        return vehicleCondition === condition.toLowerCase();
    }
  });
}

export function getStyleStats(vehicles: Vehicle[]): StyleStats[] {
  const styleMap = new Map<string, { models: Set<string>, count: number }>();
  
  vehicles.forEach(vehicle => {
    // Use centralized normalizer to ensure consistent categorization
    const normalizedStyle = normalizeCategory(vehicle.bodyStyle || '');
    const modelKey = `${vehicle.make} ${vehicle.model}`;
    
    if (!styleMap.has(normalizedStyle)) {
      styleMap.set(normalizedStyle, { models: new Set(), count: 0 });
    }
    
    const styleData = styleMap.get(normalizedStyle)!;
    styleData.models.add(modelKey);
    styleData.count++;
  });
  
  return Array.from(styleMap.entries()).map(([rawValue, data]) => ({
    name: getDisplayName(rawValue),
    models: data.models.size,
    stock: data.count,
  })).sort((a, b) => b.stock - a.stock);
}

export function getVehicleById(vehicles: Vehicle[], id: string): Vehicle | undefined {
  return vehicles.find(vehicle => vehicle.id === id);
}

function generateMockVehicleData(): Vehicle[] {
  const mockVehicles: Vehicle[] = [];
  
  const models = {
    'Ford': ['F-150', 'Explorer', 'Mustang', 'Escape', 'Edge'],
    'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Camaro'],
    'Toyota': ['Camry', 'RAV4', 'Highlander', 'Tacoma', 'Prius'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey'],
    'BMW': ['3 Series', 'X3', 'X5', '5 Series', '7 Series'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class'],
    'Audi': ['A4', 'Q5', 'Q7', 'A6', 'A8'],
    'Nissan': ['Altima', 'Rogue', 'Pathfinder', 'Frontier', 'Sentra']
  } as const;
  
  const makes = Object.keys(models) as Array<keyof typeof models>;
  
  const bodyStyles = ['SUV', 'TRUCK', 'SEDAN', 'HATCHBACK', 'COUPE'];
  const conditions = ['VERY_GOOD']; // All vehicles are pre-owned with VERY_GOOD condition
  const colors = ['Black', 'White', 'Silver', 'Blue', 'Red', 'Gray'];
  
  for (let i = 1; i <= 50; i++) {
    const make = makes[Math.floor(Math.random() * makes.length)];
    const model = models[make][Math.floor(Math.random() * models[make].length)];
    const year = 2020 + Math.floor(Math.random() * 5);
    const bodyStyle = bodyStyles[Math.floor(Math.random() * bodyStyles.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const price = 15000 + Math.floor(Math.random() * 50000);
    const mileage = condition === 'NEW' ? Math.floor(Math.random() * 100) : Math.floor(Math.random() * 100000);
    
    mockVehicles.push({
      id: `mock-${i}`,
      title: `${year} ${make} ${model}`,
      description: `Beautiful ${year} ${make} ${model} in excellent condition.`,
      availability: 'in stock',
      condition: condition, // Keep original case to match CSV data
      price: price,
      salePrice: price - Math.floor(Math.random() * 2000),
      url: `https://example.com/vehicle/${i}`,
      dealerUrl: 'https://autoplexmke.com',
      vin: `1HGBH41JXMN${String(i).padStart(6, '0')}`,
      transmission: 'Automatic',
      bodyStyle: normalizeCategory(bodyStyle),
      fuelType: 'Gasoline',
      vehicleType: 'Car',
      drivetrain: bodyStyle === 'TRUCK' || bodyStyle === 'SUV' ? '4WD' : 'FWD',
      daysOnLot: String(Math.floor(Math.random() * 90)),
      previousPrice: String(price + Math.floor(Math.random() * 3000)),
      address: {
        addr1: '1234 Main Street',
        addr2: '',
        addr3: '',
        city: 'Milwaukee',
        region: 'WI',
        postalCode: '53202',
        country: 'US'
      },
      stateOfVehicle: condition.toLowerCase(),
      exteriorColor: colors[Math.floor(Math.random() * colors.length)],
      interiorColor: 'Black',
      make: make,
      model: model,
      trim: 'Base',
      year: year,
      dealerName: 'Autoplex MKE',
      stockNumber: `AP${String(i).padStart(4, '0')}`,
      mileage: {
        value: mileage,
        unit: 'MI'
      },
      images: [
        `https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop&auto=format`,
        `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format`,
        `https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop&auto=format`
      ]
    });
  }
  
  return mockVehicles;
}
