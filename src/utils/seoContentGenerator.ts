// SEO Content Generator - Creates unique content for each city/service combination
// Anti-duplicate content strategy

import { SeoService } from '../config/seoServices';
import { SeoCity } from '../config/seoCities';

export interface SeoPageContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  benefits: string[];
  commonJobs: string[];
  serviceAreas: string[];
  priceInfo: string;
  faqs: Array<{ question: string; answer: string }>;
}

// Content variation templates to avoid duplication
const introTemplates = [
  (service: string, city: string, desc: string) => 
    `Looking for professional ${service.toLowerCase()} in ${city}? Our expert team provides reliable and affordable services throughout ${desc}. We understand the unique needs of ${city} residents and businesses, offering tailored solutions for every requirement.`,
  
  (service: string, city: string, desc: string) =>
    `Welcome to ShiftMyHome's ${service.toLowerCase()} service in ${city}. As ${desc}, we know the area inside out and provide seamless services across all postcodes. Whether you're moving locally or need urgent assistance, we're here to help.`,
  
  (service: string, city: string, desc: string) =>
    `Need ${service.toLowerCase()} in ${city}? We're your local experts serving ${desc}. With years of experience in the area, we deliver professional, efficient, and cost-effective solutions tailored to your specific needs.`,
  
  (service: string, city: string, desc: string) =>
    `ShiftMyHome offers premium ${service.toLowerCase()} throughout ${city}. As specialists in ${desc}, we pride ourselves on exceptional service, competitive pricing, and complete customer satisfaction. Get your free quote today.`
];

const benefitTemplates = {
  'house-move': [
    'Full packing and unpacking service available',
    'Experienced team trained in safe furniture handling',
    'Comprehensive insurance coverage included',
    'Flexible scheduling including evenings and weekends',
    'Local knowledge of parking restrictions and access'
  ],
  'furniture-and-items': [
    'Professional wrapping and protection for all items',
    'Same-day and next-day delivery options',
    'Two-person team for safe handling',
    'Assembly and disassembly service available',
    'Real-time tracking and updates'
  ],
  'house-clearance': [
    'Environmentally responsible disposal',
    'Licensed waste carrier with full documentation',
    'Donation of reusable items to local charities',
    'Complete property clearance in one visit',
    'Probate and estate clearance specialists'
  ],
  'garden-clearance': [
    'Eco-friendly disposal of green waste',
    'Same-day clearance available',
    'All waste removed and recycled where possible',
    'No job too big or small',
    'Garden furniture removal included'
  ],
  'builders-waste': [
    'Licensed for all construction waste types',
    'Skip hire alternative - pay only for what you use',
    'Same-day collection available',
    'Segregated recycling to reduce landfill',
    'Site clearance and cleanup'
  ],
  'junk-removal': [
    '80% of items recycled or donated',
    'Two-hour arrival windows',
    'No hidden fees - price includes everything',
    'Load and go service - you point, we remove',
    'Electronic waste disposal included'
  ],
  'store-pickup-delivery': [
    'Collection from any major retailer',
    'White glove delivery service',
    'Removal of packaging and old items',
    'Evening and weekend delivery slots',
    'Installation service available'
  ],
  'motorcycle-transport': [
    'Specialist motorcycle transport equipment',
    'Fully insured door-to-door service',
    'Enclosed transport for classic bikes',
    'UK-wide collection and delivery',
    'Professional riders for loading/unloading'
  ],
  'vehicle-transport': [
    'Enclosed and open transport options',
    'Trade and private vehicle specialists',
    'Full inspection before and after transport',
    'Classic and prestige car experience',
    'Track day and auction transport'
  ]
};

const jobTemplates: { [key: string]: string[] } = {
  'house-move': [
    '1-2 bedroom flat moves within the city',
    '3-4 bedroom family home relocations',
    'Student accommodation moves',
    'Short-notice emergency moves',
    'Long-distance moves to/from Scotland'
  ],
  'furniture-and-items': [
    'Large sofa and sectional deliveries',
    'Bed frame and mattress transport',
    'Wardrobe and cabinet moves',
    'Dining table and chair sets',
    'Appliance collection and delivery'
  ],
  'house-clearance': [
    'Full house clearance after bereavement',
    'Downsizing and decluttering projects',
    'Rental property clearance for landlords',
    'Garage and loft clearance',
    'Hoarding cleanup and support'
  ],
  'garden-clearance': [
    'Overgrown garden clearance',
    'Post-landscaping waste removal',
    'Seasonal garden cleanup',
    'Tree and hedge cutting waste',
    'Shed and greenhouse dismantling'
  ],
  'builders-waste': [
    'Kitchen and bathroom renovation waste',
    'Extension and loft conversion debris',
    'Demolition and strip-out clearance',
    'Plastering and dry lining waste',
    'Tiling and flooring material removal'
  ],
  'junk-removal': [
    'Old furniture and mattress removal',
    'White goods and appliance disposal',
    'Office equipment clearance',
    'Garage and shed junk removal',
    'Pre-move decluttering service'
  ],
  'store-pickup-delivery': [
    'IKEA collection and assembly',
    'John Lewis and Next deliveries',
    'Appliance Direct pickup service',
    'DFS and ScS furniture delivery',
    'Online marketplace collections'
  ],
  'motorcycle-transport': [
    'Sportsbike transport for track days',
    'Classic motorcycle collection',
    'Touring bike long-distance moves',
    'Scooter and moped delivery',
    'Non-running motorcycle recovery'
  ],
  'vehicle-transport': [
    'Classic car show transport',
    'Auction collection and delivery',
    'Trade vehicle movement',
    'Prestige and luxury car transport',
    'Project car relocation'
  ]
};

// Generate unique FAQ based on service and city
function generateFAQs(service: SeoService, city: SeoCity): Array<{ question: string; answer: string }> {
  const baseUrl = `https://shiftmyhome.co.uk/${service.slug}/${city.slug}`;
  
  const faqSets = [
    [
      {
        question: `How much does ${service.name.toLowerCase()} cost in ${city.name}?`,
        answer: `${service.name} prices in ${city.name} typically range from £${service.priceRange.min} to £${service.priceRange.max} depending on the size and complexity of the job. We offer free, no-obligation quotes tailored to your specific requirements. Contact us today for an accurate price estimate.`
      },
      {
        question: `Do you cover all areas of ${city.name}?`,
        answer: `Yes! We provide ${service.name.toLowerCase()} throughout ${city.name} and surrounding areas including ${city.nearbyAreas.slice(0, 3).join(', ')}. We serve all ${city.postcodeArea.slice(0, 3).join(', ')} postcodes and beyond. Check our coverage map for specific areas.`
      },
      {
        question: `How quickly can you provide ${service.name.toLowerCase()} in ${city.name}?`,
        answer: `We offer flexible scheduling including same-day and next-day services subject to availability. For ${city.name} residents, we typically can arrange collection within 24-48 hours. Emergency and urgent requests may be accommodated - please call us to discuss your requirements.`
      },
      {
        question: `Are you licensed and insured in ${city.name}?`,
        answer: `Absolutely. ShiftMyHome is a fully licensed waste carrier and registered with the Scottish Environment Protection Agency (SEPA). All our services in ${city.name} are covered by comprehensive public and goods-in-transit insurance for your complete peace of mind.`
      },
      {
        question: `What payment methods do you accept in ${city.name}?`,
        answer: `We accept all major payment methods including card payments, bank transfer, and cash. Payment is typically due on completion of the service. For larger jobs in ${city.name}, we can arrange deposit payments if required.`
      }
    ],
    [
      {
        question: `What areas near ${city.name} do you serve?`,
        answer: `We cover ${city.name} and all nearby areas including ${city.nearbyAreas.slice(0, 4).join(', ')}, plus surrounding villages and towns within ${city.region}. We regularly serve all ${city.postcodeArea.slice(0, 3).join(', ')} postcodes.`
      },
      {
        question: `Do you recycle items collected in ${city.name}?`,
        answer: `Yes, environmental responsibility is core to our service. We recycle up to 80% of items collected in ${city.name}, working with local recycling centers and charities. Reusable items are donated to ${city.name} community organizations where possible.`
      },
      {
        question: `Can I get a quote for ${service.name.toLowerCase()} in ${city.name}?`,
        answer: `Of course! We provide free, no-obligation quotes for all ${service.name.toLowerCase()} in ${city.name}. You can get an instant online quote, call us, or request a visit for larger jobs. All quotes are transparent with no hidden fees.`
      },
      {
        question: `What makes ShiftMyHome different in ${city.name}?`,
        answer: `We're local experts with deep knowledge of ${city.name} - from parking restrictions to best access routes. Our team is professional, punctual, and focused on customer satisfaction. We're fully licensed, insured, and committed to environmental responsibility in everything we do.`
      },
      {
        question: `Do you provide ${service.name.toLowerCase()} at weekends in ${city.name}?`,
        answer: `Yes! We operate 7 days a week including evenings and weekends to fit around your schedule. Weekend slots in ${city.name} are popular, so we recommend booking in advance. Same-day weekend service may be available - contact us to check.`
      }
    ]
  ];

  // Alternate between FAQ sets based on city name hash
  const setIndex = city.name.length % faqSets.length;
  return faqSets[setIndex];
}

// Main content generator
export function generateSeoContent(service: SeoService, city: SeoCity): SeoPageContent {
  // Use city characteristics to create variation
  const templateIndex = (city.name.charCodeAt(0) + service.id.length) % introTemplates.length;
  const intro = introTemplates[templateIndex](service.name, city.name, city.description);

  // Generate unique H1 and meta tags
  const h1 = `${service.name} in ${city.name} | Professional & Affordable`;
  const metaTitle = `${service.name} ${city.name} | From £${service.priceRange.min} | ShiftMyHome`;
  const metaDescription = `Expert ${service.name.toLowerCase()} in ${city.name}. Covering all ${city.postcodeArea.slice(0, 3).join(', ')} postcodes. Fully insured, eco-friendly, instant quotes. Book online or call today.`;

  // Get service-specific benefits
  const benefits = benefitTemplates[service.slug] || [
    'Professional and experienced team',
    'Competitive transparent pricing',
    'Fully insured service',
    'Flexible scheduling available',
    'Excellent customer reviews'
  ];

  // Get common jobs for this service
  const commonJobs = jobTemplates[service.slug] || [
    'Residential services',
    'Commercial services',
    'Emergency call-outs',
    'Scheduled appointments',
    'Large-scale projects'
  ];

  // Generate service areas around the city
  const serviceAreas = [
    `${city.name} City Centre`,
    ...city.nearbyAreas.slice(0, 6),
    `All ${city.postcodeArea.slice(0, 3).join(', ')} postcodes`
  ];

  // Generate price info
  const priceInfo = `${service.name} in ${city.name} typically costs between £${service.priceRange.min} and £${service.priceRange.max} per ${service.priceRange.unit}. Pricing depends on factors such as size, distance, access, and specific requirements. We provide free, detailed quotes with no hidden charges.`;

  // Generate FAQs
  const faqs = generateFAQs(service, city);

  return {
    h1,
    metaTitle,
    metaDescription,
    intro,
    benefits,
    commonJobs,
    serviceAreas,
    priceInfo,
    faqs
  };
}

// Generate structured data (Schema.org) for SEO
export function generateSchemaMarkup(service: SeoService, city: SeoCity) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': service.name,
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'ShiftMyHome',
      'image': 'https://shiftmyhome.co.uk/logo.png',
      'telephone': '0800-123-4567',
      'email': 'hello@shiftmyhome.co.uk',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': city.name,
        'addressRegion': city.region,
        'addressCountry': 'GB'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': city.lat,
        'longitude': city.lng
      },
      'areaServed': {
        '@type': 'City',
        'name': city.name
      },
      'priceRange': `£${service.priceRange.min} - £${service.priceRange.max}`
    },
    'availableChannel': {
      '@type': 'ServiceChannel',
      'serviceUrl': `https://shiftmyhome.co.uk/${service.slug}/${city.slug}`
    },
    'areaServed': city.nearbyAreas.map(area => ({
      '@type': 'Place',
      'name': area
    }))
  };
}
