import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try to fetch from Autoplex first
    const csvUrl = 'https://uniqueleverage.com/FacebookCatalogs/AutoplexMKE.csv';
    
    console.log('Attempting to fetch from Autoplex:', csvUrl);
    
    const response = await fetch(csvUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
        'User-Agent': 'Mozilla/5.0 (compatible; VehicleDataFetcher/1.0)',
      },
      signal: AbortSignal.timeout(10000),
    });
    
    if (response.ok) {
      const csvData = await response.text();
      console.log('Successfully fetched from Autoplex, length:', csvData.length);
      
      return NextResponse.json({ 
        success: true, 
        data: csvData,
        timestamp: Date.now(),
        source: 'autoplex'
      });
    } else {
      throw new Error(`Autoplex returned ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Autoplex fetch failed:', error);
    
    // Fallback to sample data
    console.log('Using fallback sample data');
    const sampleData = `id,title,description,availability,condition,price,salePrice,url,dealerUrl,vin,transmission,bodyStyle,fuelType,vehicleType,drivetrain,daysOnLot,previousPrice,addr1,addr2,addr3,city,region,postalCode,country,stateOfVehicle,exteriorColor,interiorColor,make,model,trim,year,dealerName,stockNumber,mileage_value,mileage_unit,images
1,2020 Ford F-150 XLT SuperCrew,Well-maintained pickup truck with low mileage,In Stock,Used,35000,32000,https://example.com/ford-f150,https://dealer.com/ford-f150,1FTFW1ET5LFA12345,Automatic,Truck,Gasoline,Truck,AWD,15,36000,123 Main St,,,Milwaukee,WI,53201,USA,Good,White,Black,Ford,F-150,XLT,2020,AutoMax Milwaukee,AM001,25000,miles,https://example.com/ford-f150-1.jpg
2,2019 Toyota Camry LE,Reliable sedan with excellent fuel economy,In Stock,Used,22000,21000,https://example.com/toyota-camry,https://dealer.com/toyota-camry,4T1C11AK5KU123456,Automatic,Sedan,Gasoline,Car,FWD,8,23000,456 Oak Ave,,,Milwaukee,WI,53202,USA,Excellent,Silver,Gray,Toyota,Camry,LE,2019,Metro Toyota,MT002,35000,miles,https://example.com/toyota-camry-1.jpg
3,2021 Honda CR-V EX,Spacious SUV perfect for families,In Stock,Certified,28000,27000,https://example.com/honda-crv,https://dealer.com/honda-crv,2HKRW2H85MH123456,Automatic,SUV,Gasoline,SUV,AWD,5,29000,789 Pine St,,,Milwaukee,WI,53203,USA,Excellent,Blue,Tan,Honda,CR-V,EX,2021,City Honda,CH003,18000,miles,https://example.com/honda-crv-1.jpg`;

    return NextResponse.json({ 
      success: true, 
      data: sampleData,
      timestamp: Date.now(),
      source: 'fallback'
    });
  }
}