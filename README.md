# Vehicle Inventory Management System

A modern, responsive vehicle inventory management system built with Next.js, featuring a clean SaaS-style UI inspired by Untitled UI and Airbnb.

## 🚀 Features

- **Modern UI/UX**: Clean, professional design with black/white pill filters
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Vehicle Gallery**: Airbnb-style 5-photo gallery with perfect alignment
- **Dynamic Filtering**: Filter vehicles by body style (Sedan, Truck, SUV, etc.)
- **Real-time Data**: Fetches vehicle data from CSV feed with fallback
- **Interactive Cards**: Hover effects and clean vehicle information display
- **Dynamic URLs**: Browser URLs reflect selected vehicles
- **Breadcrumb Navigation**: Clear navigation hierarchy

## 🛠 Tech Stack

- **Framework**: Next.js 15.4.5 with Turbopack
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **UI Components**: Custom components inspired by Untitled UI
- **Data Source**: CSV feed with caching and mock data fallback

## 📱 Pages

- **Introduction Page**: Main landing page with navigation
- **Inventory Listing**: Grid view of all vehicles with filtering
- **Vehicle Detail (VSP)**: Detailed view with 5-photo gallery
- **Documentation**: Component documentation and guides

## 🎨 Design Highlights

- **Filter Pills**: Black/white styling with active states
- **Vehicle Cards**: Clean layout without pills on images
- **Gallery Layout**: 1 main image + 4 smaller images in 2x2 grid
- **Responsive Images**: Full vehicle visibility with proper aspect ratios
- **Typography**: Balanced font sizes and information hierarchy

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vehicle-inventory-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

This project is configured for deployment on Render:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18+

## 🔧 Configuration

- **Data Source**: Configured to fetch from `https://uniqueleverage.com/FacebookCatalogs/AutoplexMKE.csv`
- **Fallback**: Includes mock data for development and testing
- **Caching**: Built-in data caching for performance

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/             # Reusable UI components
│   ├── application/        # App-specific components
│   ├── base/              # Base UI components
│   ├── landing/           # Landing page components
│   └── marketing/         # Marketing components
├── lib/                   # Utility functions and data fetching
├── styles/                # Global styles and themes
└── utils/                 # Helper utilities
```

## 🎯 Key Components

- **VehicleGallery**: Responsive 5-photo gallery component
- **Filter Pills**: Dynamic filtering system
- **Vehicle Cards**: Clean vehicle display cards
- **Navigation**: Sidebar and breadcrumb navigation

## 📄 License

This project is proprietary software developed for Unique Leverage.

---

Built with ❤️ using Next.js and Tailwind CSS