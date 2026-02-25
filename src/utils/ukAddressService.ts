/**
 * UK Address Lookup Service
 * Uses getAddress.io for postcode and address autocomplete
 */

export interface UKAddress {
  line_1: string;        // House number + street
  line_2?: string;       // Building name, etc.
  line_3?: string;       // District
  post_town: string;     // City/Town
  postcode: string;      // Full postcode
  county?: string;       // County
  latitude?: number;
  longitude?: number;
  // Parsed fields
  building_number?: string;
  building_name?: string;
  street?: string;
  fullAddress: string;   // Complete formatted address
}

export interface AddressSearchResult {
  id: string;
  address: string;
  fullDetails?: UKAddress;
}

class UKAddressService {
  private getAddressKey: string | null = null;
  private keysLoaded: boolean = false;
  private loadingPromise: Promise<void> | null = null;
  private isRateLimited: boolean = false;

  constructor() {
    // Start loading keys immediately
    this.loadingPromise = this.loadApiKeys();
  }

  private async loadApiKeys(): Promise<void> {
    if (this.keysLoaded) return;

    // Try environment variables first (Vite)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      this.getAddressKey = 
        (import.meta as any).env.VITE_GETADDRESS_API_KEY || 
        (import.meta as any).env.NEXT_PUBLIC_GETADDRESS_API_KEY || 
        (import.meta as any).env.GETADDRESS_API_KEY || 
        null;
    }

    // Try Deno env (backend)
    if (!this.getAddressKey && typeof Deno !== 'undefined' && Deno.env) {
      try {
        this.getAddressKey = Deno.env.get('GETADDRESS_API_KEY') || null;
      } catch (e) {
        // Deno env not available
      }
    }

    // Fetch from backend (authoritative source)
    try {
      const infoModule = await import('./supabase/info');
      const { projectId, publicAnonKey } = infoModule;
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-94f26792/api/config/address-lookup`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      
      if (response.ok) {
        const config = await response.json();
        if (config.getAddressKey) {
          this.getAddressKey = config.getAddressKey;
          console.log('✅ getAddress.io API key loaded from backend');
        }
      }
    } catch (e) {
      // Backend not available, use environment variables
      console.log('⚠️ Backend config unavailable, using environment variables');
    }

    this.keysLoaded = true;
  }

  /**
   * Ensure keys are loaded before making API calls
   */
  private async ensureKeysLoaded(): Promise<void> {
    if (this.loadingPromise) {
      await this.loadingPromise;
    }
  }

  /**
   * Search for addresses by postcode or partial address
   */
  async searchAddresses(query: string): Promise<AddressSearchResult[]> {
    const cleanQuery = query.trim();
    if (cleanQuery.length < 2) {
      return [];
    }

    await this.ensureKeysLoaded();

    // If no key or rate limited, return empty for manual entry
    if (!this.getAddressKey || this.isRateLimited) {
      return [];
    }

    try {
      const response = await fetch(
        `https://api.getaddress.io/autocomplete/${encodeURIComponent(cleanQuery)}?api-key=${this.getAddressKey}&all=true`
      );

      if (!response.ok) {
        if (response.status === 429) {
          this.isRateLimited = true;
        }
        // Silent fail - return empty for manual entry
        return [];
      }

      const data = await response.json();

      if (data.suggestions) {
        return data.suggestions.map((suggestion: any) => ({
          id: suggestion.id || String(Math.random()),
          address: suggestion.address,
          fullDetails: undefined
        }));
      }
    } catch (error) {
      // Silent fail - allow manual entry
      console.log('Address lookup unavailable, use manual entry');
    }

    return [];
  }

  /**
   * Get full address details by ID
   */
  async getAddressById(id: string): Promise<UKAddress | null> {
    await this.ensureKeysLoaded();

    if (!this.getAddressKey || this.isRateLimited) {
      return null;
    }

    try {
      const response = await fetch(
        `https://api.getaddress.io/get/${encodeURIComponent(id)}?api-key=${this.getAddressKey}`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      
      if (data) {
        return {
          line_1: data.line_1 || '',
          line_2: data.line_2 || '',
          line_3: data.line_3 || '',
          post_town: data.town_or_city || data.locality || '',
          postcode: data.postcode || '',
          county: data.county || '',
          latitude: data.latitude,
          longitude: data.longitude,
          building_number: data.building_number || '',
          building_name: data.building_name || '',
          street: data.thoroughfare || '',
          fullAddress: [
            data.line_1,
            data.line_2,
            data.line_3,
            data.town_or_city,
            data.postcode
          ].filter(Boolean).join(', ')
        };
      }
    } catch (error) {
      // Silent fail
    }

    return null;
  }

  /**
   * Lookup addresses by full postcode
   */
  async lookupPostcode(postcode: string): Promise<UKAddress[]> {
    const cleanPostcode = postcode.trim().toUpperCase();

    await this.ensureKeysLoaded();

    if (!this.getAddressKey || this.isRateLimited) {
      return [];
    }

    try {
      const response = await fetch(
        `https://api.getaddress.io/find/${encodeURIComponent(cleanPostcode)}?api-key=${this.getAddressKey}&expand=true`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      
      if (data.addresses) {
        return data.addresses.map((addr: any) => ({
          line_1: addr.line_1 || addr.formatted_address?.[0] || '',
          line_2: addr.line_2 || addr.formatted_address?.[1] || '',
          line_3: addr.line_3 || '',
          post_town: addr.town_or_city || addr.locality || '',
          postcode: cleanPostcode,
          county: addr.county || '',
          latitude: addr.latitude,
          longitude: addr.longitude,
          fullAddress: [
            addr.line_1,
            addr.line_2,
            addr.line_3,
            addr.town_or_city,
            cleanPostcode
          ].filter(Boolean).join(', ')
        }));
      }
    } catch (error) {
      // Silent fail
    }

    return [];
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return !!this.getAddressKey && !this.isRateLimited;
  }

  /**
   * Get current provider
   */
  getCurrentProvider(): string {
    return this.getAddressKey ? 'getAddress.io' : 'Manual Entry';
  }
}

// Export singleton instance
export const ukAddressService = new UKAddressService();