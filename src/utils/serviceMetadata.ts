import { Home, Armchair, Trash2, Bike, Store, Package } from 'lucide-react';

export interface ServiceMetadata {
  id: string;
  title: string;
  description: string;
  icon: any;
  gradient: string;
}

export const serviceMetadata: Record<string, ServiceMetadata> = {
  'house-move': {
    id: 'house-move',
    title: 'House Move',
    description: 'Complete home relocations with professional care',
    icon: Home,
    gradient: 'from-blue-500 to-indigo-600',
  },
  'furniture': {
    id: 'furniture',
    title: 'Furniture & Items',
    description: 'Sofas, beds, wardrobes delivered safely',
    icon: Armchair,
    gradient: 'from-purple-500 to-pink-600',
  },
  'clearance': {
    id: 'clearance',
    title: 'Clearance & Removal',
    description: 'House, garden, builders and junk clearance',
    icon: Trash2,
    gradient: 'from-orange-500 to-red-600',
  },
  'motorbike': {
    id: 'motorbike',
    title: 'Motorbike & Bicycle Transport',
    description: 'Secure transport for your vehicles',
    icon: Bike,
    gradient: 'from-orange-500 to-red-600',
  },
  'store-pickup': {
    id: 'store-pickup',
    title: 'Store / Pickup Service',
    description: 'IKEA, B&Q, and retail pickups',
    icon: Store,
    gradient: 'from-emerald-500 to-teal-600',
  },
  'other': {
    id: 'other',
    title: 'Other Delivery',
    description: 'Custom solutions for any item',
    icon: Package,
    gradient: 'from-amber-500 to-yellow-600',
  },
};

export function getServiceMetadata(serviceId: string): ServiceMetadata | null {
  return serviceMetadata[serviceId] || null;
}

export function getServiceTitle(serviceId: string): string {
  return serviceMetadata[serviceId]?.title || 'Service';
}