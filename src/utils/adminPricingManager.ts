/**
 * Admin Pricing Manager
 * Manages saving and loading of pricing configuration for admin panel
 */

const STORAGE_KEYS = {
  VEHICLE_RATES: 'smh_admin_vehicle_rates',
  EXTRAS: 'smh_admin_extras',
  PRICING_CONFIG: 'smh_admin_pricing_config',
};

export const adminPricingManager = {
  // Vehicle Rates
  getVehicleRates(): any[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VEHICLE_RATES);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading vehicle rates:', error);
      return [];
    }
  },

  saveVehicleRates(rates: any[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VEHICLE_RATES, JSON.stringify(rates));
    } catch (error) {
      console.error('Error saving vehicle rates:', error);
    }
  },

  // Extras
  getExtras(): any[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXTRAS);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading extras:', error);
      return [];
    }
  },

  saveExtras(extras: any[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EXTRAS, JSON.stringify(extras));
    } catch (error) {
      console.error('Error saving extras:', error);
    }
  },

  // Pricing Config
  getPricingConfig(): any {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRICING_CONFIG);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading pricing config:', error);
      return null;
    }
  },

  savePricingConfig(config: any): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRICING_CONFIG, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving pricing config:', error);
    }
  },

  // Clear all pricing data
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.VEHICLE_RATES);
      localStorage.removeItem(STORAGE_KEYS.EXTRAS);
      localStorage.removeItem(STORAGE_KEYS.PRICING_CONFIG);
    } catch (error) {
      console.error('Error clearing pricing data:', error);
    }
  },
};
