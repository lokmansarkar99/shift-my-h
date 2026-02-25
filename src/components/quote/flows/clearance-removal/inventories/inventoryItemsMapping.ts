/**
 * Centralized mapping of all inventory items across all categories
 * Maps itemId → display name
 */

export const INVENTORY_ITEMS_MAP: Record<string, string> = {
  // FURNITURE - Living Room
  'sofa-3-seater': '3-Seater Sofa',
  'sofa-2-seater': '2-Seater Sofa',
  'armchair': 'Armchair',
  'coffee-table': 'Coffee Table',
  'tv-unit': 'TV Unit',
  'bookshelf': 'Bookshelf',
  'sideboard': 'Sideboard',
  'rug': 'Rug (rolled)',

  // FURNITURE - Bedroom
  'double-bed': 'Double Bed Frame',
  'single-bed': 'Single Bed Frame',
  'mattress-double': 'Double Mattress',
  'mattress-single': 'Single Mattress',
  'wardrobe-2door': '2-Door Wardrobe',
  'wardrobe-3door': '3-Door Wardrobe',
  'chest-drawers': 'Chest of Drawers',
  'bedside-table': 'Bedside Table',
  'dressing-table': 'Dressing Table',

  // FURNITURE - Kitchen
  'dining-table-4': 'Dining Table (4-seater)',
  'dining-table-6': 'Dining Table (6-seater)',
  'dining-chair': 'Dining Chair',
  'kitchen-unit': 'Kitchen Unit',
  'kitchen-cupboard': 'Kitchen Cupboard',

  // FURNITURE - Appliances
  'fridge': 'Fridge',
  'fridge-freezer': 'Fridge-Freezer',
  'washing-machine': 'Washing Machine',
  'tumble-dryer': 'Tumble Dryer',
  'dishwasher': 'Dishwasher',
  'cooker': 'Cooker/Oven',
  'microwave': 'Microwave',
  'tv': 'TV',

  // FURNITURE - Boxes
  'small-box': 'Small Box',
  'medium-box': 'Medium Box',
  'large-box': 'Large Box',
  'black-bag': 'Black Bag',

  // OFFICE - Desks
  'office-desk': 'Office Desk',
  'office-chair': 'Office Chair',
  'meeting-table': 'Meeting Table',
  'visitor-chair': 'Visitor Chair',

  // OFFICE - Storage
  'filing-cabinet-2': '2-Drawer Filing Cabinet',
  'filing-cabinet-4': '4-Drawer Filing Cabinet',
  'bookshelf-office': 'Bookshelf',
  'storage-cupboard': 'Storage Cupboard',

  // OFFICE - Electronics
  'computer': 'Computer/Monitor',
  'printer': 'Printer',
  'phone-system': 'Phone System',
  'server-rack': 'Server Rack (small)',

  // WASTE - Bags
  'black-bag': 'Black Bag',
  'rubble-bag': 'Rubble Bag',
  'garden-bag': 'Garden Waste Bag',

  // WASTE - Bulky
  'mattress': 'Mattress',
  'old-sofa': 'Old Sofa',
  'old-armchair': 'Old Armchair',
  'old-table': 'Old Table',
  'old-carpet': 'Old Carpet (rolled)',
  'old-wardrobe': 'Old Wardrobe',

  // WASTE - Green Waste
  'branches-bundle': 'Branches (bundle)',
  'grass-cuttings-bag': 'Grass Cuttings (bag)',
  'leaves-bag': 'Leaves (bag)',
  'hedge-trimmings-bag': 'Hedge Trimmings (bag)',
  'small-tree': 'Small Tree/Shrub',

  // WASTE - Soil
  'soil-bag': 'Soil (bag)',
  'turf-roll': 'Turf (roll)',
  'paving-slabs': 'Paving Slabs',
  'rubble-small': 'Rubble (small amount)',

  // WASTE - Mixed
  'general-junk-small': 'General Junk (small items)',
  'general-junk-medium': 'General Junk (medium items)',
  'general-junk-large': 'General Junk (large items)',
  'mixed-waste-bag': 'Mixed Waste (bag)',

  // WASTE - Wood/Metal
  'timber-small': 'Timber (small pieces)',
  'timber-large': 'Timber (large pieces)',
  'metal-scrap-small': 'Metal Scrap (small)',
  'old-fence-panel': 'Old Fence Panel',

  // BUILDERS - Rubble
  'bricks-loose': 'Loose Bricks',
  'concrete-rubble': 'Concrete Rubble',
  'blocks': 'Blocks',
  'hardcore': 'Hardcore',
  'rubble-bag-builders': 'Rubble (bag)',

  // BUILDERS - Timber
  'timber-offcuts': 'Timber Offcuts',
  'floorboards': 'Floorboards',
  'joists': 'Joists',
  'plywood-sheets': 'Plywood Sheets',
  'mdf-sheets': 'MDF Sheets',

  // BUILDERS - Plasterboard
  'plasterboard-sheets': 'Plasterboard Sheets',
  'plasterboard-offcuts': 'Plasterboard Offcuts',
  'ceiling-tiles': 'Ceiling Tiles',

  // BUILDERS - Tiles
  'floor-tiles': 'Floor Tiles',
  'wall-tiles': 'Wall Tiles',
  'slate-tiles': 'Slate/Roof Tiles',

  // BUILDERS - Mixed Bags
  'mixed-builders-bag': 'Mixed Builders Waste (bag)',
  'insulation-bag': 'Insulation (bag)',
  'packaging-bag': 'Packaging (bag)',

  // GARAGE/MIXED - Tools
  'toolbox': 'Toolbox',
  'power-tools': 'Power Tools',
  'garden-tools': 'Garden Tools',
  'ladder': 'Ladder',
  'workbench': 'Workbench',

  // GARAGE/MIXED - Shelves
  'metal-shelving': 'Metal Shelving Unit',
  'plastic-shelving': 'Plastic Shelving Unit',
  'storage-cupboard-garage': 'Storage Cupboard',
  'storage-boxes': 'Storage Boxes',

  // GARAGE/MIXED - Tyres
  'car-tyres': 'Car Tyres',
  'bike-tyres': 'Bike/Motorcycle Tyres',
  'car-parts': 'Car Parts',
  'bike-parts': 'Bike Parts',

  // GARAGE/MIXED - Boxes
  'small-box-garage': 'Small Box',
  'medium-box-garage': 'Medium Box',
  'large-box-garage': 'Large Box',
  'black-bag-garage': 'Black Bag',
};

/**
 * Get display name for an item ID
 */
export function getItemName(itemId: string): string {
  return INVENTORY_ITEMS_MAP[itemId] || itemId;
}

/**
 * Get all selected items with names and quantities
 */
export function getSelectedItemsList(items: Record<string, number>): Array<{ id: string; name: string; quantity: number }> {
  return Object.entries(items)
    .map(([id, quantity]) => ({
      id,
      name: getItemName(id),
      quantity,
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
}
