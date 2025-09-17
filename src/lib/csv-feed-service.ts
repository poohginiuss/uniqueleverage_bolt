/**
 * Dynamic CSV Feed Service
 * 
 * This service handles automatic updates from the FTP CSV feed.
 * It polls for changes and updates the local cache when new data is available.
 */

import { fetchVehicleData } from './vehicle-data';

interface FeedConfig {
  url: string;
  pollIntervalMs: number;
  cacheKey: string;
  lastModifiedKey: string;
}

const DEFAULT_CONFIG: FeedConfig = {
  url: 'https://uniqueleverage.com/FacebookCatalogs/AutoplexMKE.csv',
  pollIntervalMs: 5 * 60 * 1000, // 5 minutes
  cacheKey: 'vehicle-data-cache',
  lastModifiedKey: 'vehicle-data-last-modified'
};

class CSVFeedService {
  private config: FeedConfig;
  private pollInterval: NodeJS.Timeout | null = null;
  private isPolling = false;

  constructor(config: Partial<FeedConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Start polling for CSV updates
   */
  startPolling(): void {
    if (this.isPolling) return;
    
    this.isPolling = true;
    console.log(`Starting CSV feed polling every ${this.config.pollIntervalMs / 1000}s`);
    
    // Initial fetch
    this.checkForUpdates();
    
    // Set up polling
    this.pollInterval = setInterval(() => {
      this.checkForUpdates();
    }, this.config.pollIntervalMs);
  }

  /**
   * Stop polling for updates
   */
  stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.isPolling = false;
    console.log('Stopped CSV feed polling');
  }

  /**
   * Check for updates and refresh cache if needed
   */
  private async checkForUpdates(): Promise<void> {
    try {
      const lastModified = await this.getLastModified();
      const currentModified = await this.fetchLastModified();
      
      if (currentModified && currentModified !== lastModified) {
        console.log('CSV feed updated, refreshing cache...');
        await this.refreshCache();
        await this.setLastModified(currentModified);
      }
    } catch (error) {
      console.error('Error checking for CSV updates:', error);
    }
  }

  /**
   * Get the last modified timestamp from local storage
   */
  private async getLastModified(): Promise<string | null> {
    if (typeof window === 'undefined') return null; // Server-side
    
    try {
      return localStorage.getItem(this.config.lastModifiedKey);
    } catch {
      return null;
    }
  }

  /**
   * Set the last modified timestamp in local storage
   */
  private async setLastModified(timestamp: string): Promise<void> {
    if (typeof window === 'undefined') return; // Server-side
    
    try {
      localStorage.setItem(this.config.lastModifiedKey, timestamp);
    } catch (error) {
      console.error('Error saving last modified timestamp:', error);
    }
  }

  /**
   * Fetch the last modified timestamp from the server
   */
  private async fetchLastModified(): Promise<string | null> {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.timestamp) {
          return result.timestamp.toString();
        }
      }
    } catch (error) {
      console.error('Error fetching last modified timestamp:', error);
    }
    
    return null;
  }

  /**
   * Refresh the vehicle data cache
   */
  private async refreshCache(): Promise<void> {
    try {
      const vehicles = await fetchVehicleData();
      
      if (typeof window !== 'undefined') {
        // Client-side: update localStorage cache
        localStorage.setItem(this.config.cacheKey, JSON.stringify({
          vehicles,
          timestamp: Date.now()
        }));
        
        // Dispatch custom event to notify components
        window.dispatchEvent(new CustomEvent('vehicleDataUpdated', {
          detail: { vehicles }
        }));
      }
    } catch (error) {
      console.error('Error refreshing vehicle data cache:', error);
    }
  }

  /**
   * Get cached vehicle data
   */
  async getCachedData(): Promise<any[] | null> {
    if (typeof window === 'undefined') return null; // Server-side
    
    try {
      const cached = localStorage.getItem(this.config.cacheKey);
      if (cached) {
        const { vehicles, timestamp } = JSON.parse(cached);
        
        // Check if cache is still valid (1 hour)
        const cacheAge = Date.now() - timestamp;
        if (cacheAge < 60 * 60 * 1000) {
          return vehicles;
        }
      }
    } catch (error) {
      console.error('Error reading cached vehicle data:', error);
    }
    
    return null;
  }

  /**
   * Force refresh the cache
   */
  async forceRefresh(): Promise<void> {
    await this.refreshCache();
  }
}

// Export singleton instance
export const csvFeedService = new CSVFeedService();

// Export for custom configuration
export { CSVFeedService };
