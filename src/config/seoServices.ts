// SEO Services Configuration for ShiftMyHome
// Configurable from admin panel

export interface SeoService {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: 'removal' | 'clearance' | 'transport' | 'delivery';
  priceRange: {
    min: number;
    max: number;
    unit: 'hour' | 'job' | 'item';
  };
  keywords: string[];
  commonItems?: string[];
}

export const seoServices: SeoService[] = [
  {
    id: 'house-move',
    slug: 'house-move',
    name: 'House Removals',
    shortDescription: 'Professional house moving and relocation services',
    category: 'removal',
    priceRange: { min: 299, max: 1200, unit: 'job' },
    keywords: ['house removal', 'home moving', 'relocation', 'house movers'],
    commonItems: ['furniture', 'boxes', 'appliances', 'personal belongings']
  },
  {
    id: 'furniture-and-items',
    slug: 'furniture-and-items',
    name: 'Furniture & Items Transport',
    shortDescription: 'Safe transport for furniture and large items',
    category: 'transport',
    priceRange: { min: 45, max: 250, unit: 'item' },
    keywords: ['furniture delivery', 'item transport', 'sofa delivery', 'furniture movers'],
    commonItems: ['sofas', 'beds', 'wardrobes', 'dining tables', 'appliances']
  },
  {
    id: 'house-clearance',
    slug: 'house-clearance',
    name: 'House Clearance',
    shortDescription: 'Complete house clearance and decluttering',
    category: 'clearance',
    priceRange: { min: 180, max: 800, unit: 'job' },
    keywords: ['house clearance', 'property clearance', 'estate clearance', 'probate clearance'],
    commonItems: ['furniture', 'electrical items', 'household goods', 'personal effects']
  },
  {
    id: 'garden-clearance',
    slug: 'garden-clearance',
    name: 'Garden Clearance',
    shortDescription: 'Garden waste removal and clearance services',
    category: 'clearance',
    priceRange: { min: 120, max: 600, unit: 'job' },
    keywords: ['garden clearance', 'garden waste', 'green waste removal', 'garden rubbish'],
    commonItems: ['soil', 'branches', 'leaves', 'grass cuttings', 'garden furniture']
  },
  {
    id: 'builders-waste',
    slug: 'builders-waste',
    name: 'Builders Waste Removal',
    shortDescription: 'Construction and renovation waste disposal',
    category: 'clearance',
    priceRange: { min: 150, max: 700, unit: 'job' },
    keywords: ['builders waste', 'construction waste', 'renovation rubbish', 'building debris'],
    commonItems: ['bricks', 'plasterboard', 'timber', 'rubble', 'metal', 'tiles']
  },
  {
    id: 'junk-removal',
    slug: 'junk-removal',
    name: 'Junk Removal',
    shortDescription: 'Fast junk and rubbish removal service',
    category: 'clearance',
    priceRange: { min: 80, max: 400, unit: 'job' },
    keywords: ['junk removal', 'rubbish clearance', 'waste removal', 'trash pickup'],
    commonItems: ['old furniture', 'electronics', 'mattresses', 'general waste', 'household junk']
  },
  {
    id: 'store-pickup-delivery',
    slug: 'store-pickup-delivery',
    name: 'Store Pickup & Delivery',
    shortDescription: 'Collection and delivery from retail stores',
    category: 'delivery',
    priceRange: { min: 35, max: 180, unit: 'delivery' },
    keywords: ['store pickup', 'retail delivery', 'shop collection', 'item delivery'],
    commonItems: ['furniture', 'appliances', 'electronics', 'home goods']
  },
  {
    id: 'motorcycle-transport',
    slug: 'motorcycle-transport',
    name: 'Motorcycle Transport',
    shortDescription: 'Secure motorcycle and bike transportation',
    category: 'transport',
    priceRange: { min: 120, max: 400, unit: 'job' },
    keywords: ['motorcycle transport', 'bike delivery', 'motorbike collection', 'motorcycle courier'],
    commonItems: ['motorcycles', 'scooters', 'touring bikes', 'sports bikes']
  },
  {
    id: 'vehicle-transport',
    slug: 'vehicle-transport',
    name: 'Vehicle Transport',
    shortDescription: 'Car and vehicle transportation services',
    category: 'transport',
    priceRange: { min: 180, max: 600, unit: 'job' },
    keywords: ['car transport', 'vehicle delivery', 'car courier', 'auto transport'],
    commonItems: ['cars', 'vans', 'classic vehicles', 'commercial vehicles']
  }
];

// Helper function to get service by slug
export function getServiceBySlug(slug: string): SeoService | undefined {
  return seoServices.find(s => s.slug === slug);
}

// Helper function to get all service slugs
export function getAllServiceSlugs(): string[] {
  return seoServices.map(s => s.slug);
}
