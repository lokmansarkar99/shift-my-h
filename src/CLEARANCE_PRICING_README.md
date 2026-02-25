# Clearance & Removal - Pricing System Documentation

## Overview
Professional pricing system for Clearance & Removal service with **separate Work Cost and Disposal Cost** calculation.

---

## 🎯 Pricing Formula

```
TOTAL PRICE = Work Cost + Disposal Cost + Surcharges
```

### 1. **Work Cost** (Handling & Loading)
```
Work Cost = Volume (m³) × Work Rate (£/m³) × Service Type Multiplier
```

**Default Work Rate:** £25/m³  
**Service Type Multipliers:**
- House Clearance: 1.0
- Flat Clearance: 0.95
- Office Clearance: 1.1
- Garden Clearance: 0.9
- Garage Clearance: 0.95
- **Builders Waste: 1.2** (heavier materials)
- General Junk Removal: 1.0

---

### 2. **Disposal Cost**

#### **Mode 1: `per_m3_only` (Recommended)**
```
Disposal Cost = Volume (m³) × Disposal Rate (£/m³) × Disposal Type Multiplier
```
- **Disposal Rate:** £8/m³
- **Disposal Type Multipliers:**
  - Recyclable: 0.75 (25% discount)
  - General: 1.0 (standard)
  - Restricted: 1.5 (50% surcharge)
  - Hazardous: 2.0 (100% surcharge)

#### **Mode 2: `fixed_only`**
```
Disposal Cost = Fixed Fee (e.g., £50)
```

#### **Mode 3: `fixed_plus_per_m3`**
```
Disposal Cost = Fixed Fee + (Volume × Rate)
```

#### **Special Cases:**
- **Customer provides disposal location:** `-£30 credit`
- **No disposal service selected:** `£0`

---

### 3. **Surcharges**

#### **Floor Surcharge** (No Lift)
```
Floor Surcharge = Floor Number × £15
```
- Only applies if **no lift** is available
- Ground floor = £0

#### **Parking Surcharge**
```
Parking Surcharge = (Parking Distance ÷ 10m) × £5
```
- Every 10 meters = £5

---

## 📋 Example Calculations

### Example 1: Standard House Clearance
```
Service: House Clearance
Volume: 5m³
Disposal: We dispose (general waste)
Floor: 2nd floor (no lift)
Parking: 20m

Work Cost = 5m³ × £25/m³ × 1.0 = £125.00
Disposal Cost = 5m³ × £8/m³ × 1.0 = £40.00
Floor Surcharge = 2 × £15 = £30.00
Parking Surcharge = (20 ÷ 10) × £5 = £10.00

TOTAL = £125 + £40 + £30 + £10 = £205.00
```

### Example 2: Garden Clearance with Customer Disposal
```
Service: Garden Clearance
Volume: 3m³
Disposal: Customer provides location
Floor: Ground floor
Parking: 0m

Work Cost = 3m³ × £25/m³ × 0.9 = £67.50
Disposal Cost = -£30.00 (credit)
Surcharges = £0.00

TOTAL = £67.50 - £30.00 = £37.50
(Minimum charge applies: £80.00)
```

### Example 3: Builders Waste (Recyclable)
```
Service: Builders Waste
Volume: 8m³
Disposal: We dispose (recyclable)
Floor: Ground floor (lift available)
Parking: 5m

Work Cost = 8m³ × £25/m³ × 1.2 = £240.00
Disposal Cost = 8m³ × £8/m³ × 0.75 = £48.00
Surcharges = £0.00

TOTAL = £240 + £48 = £288.00
```

---

## 🛠️ Configuration

### Admin Panel Settings
Located in `/components/admin/PricingRulesManager.tsx`:

```typescript
clearanceDisposalCharges: {
  disposal_enabled: true,
  disposal_mode: 'per_m3_only', // Recommended
  disposal_fee_fixed: 50,
  disposal_rate_per_m3: 8,
  customer_provides_disposal_discount: -30,
}
```

### Pricing Config File
`/utils/clearancePricingConfig.ts`:

```typescript
export const DEFAULT_CLEARANCE_PRICING_CONFIG: ClearancePricingConfig = {
  workRatePerM3: 25,
  disposal: {
    enabled: true,
    mode: 'per_m3_only',
    feeFixed: 0,
    ratePerM3: 8,
    customerProvidesDisposalDiscount: -30,
  },
  surcharges: {
    noLiftPerFloor: 15,
    parkingDistancePer10m: 5,
  },
  minimumCharge: 80,
};
```

---

## 📊 Data Flow

### Step 1: Address & Service Type
**Saves:**
- `clearanceServiceType` (e.g., "House Clearance")
- `disposalSelected` (true if "We'll dispose")
- `hasSpecificDisposalLocation` (true if custom location)
- `pickup.floor`, `pickup.hasLift`, `pickup.parkingDistance`

### Step 2: Inventory Selection
**Saves:**
- `inventory.items[]` - list of items with quantities
- `inventory.totalVolume` - calculated volume (m³)
- `inventory.totalItems` - total item count

### Step 3: Pricing & Quote ✨
**Calculates:**
- Work Cost
- Disposal Cost
- Surcharges
- **Total Price**

**Saves:**
```typescript
pricing: {
  workCost: number,
  disposalCost: number,
  totalPrice: number,
  breakdown: { ... }
}
```

---

## 🎨 UI Components

### Step 3 Pricing Display

**Main Breakdown:**
1. **Work Cost Card** (Blue) - Handling & loading
2. **Disposal Cost Card** (Orange/Green) - Waste disposal
3. **Surcharges Card** (Purple) - Floor + parking
4. **Total Card** (Green gradient) - Final price

**Sidebar:**
- Price Summary (collapsible breakdown)
- Map with collection location
- Collection details
- Disposal method info

---

## 🔧 Key Files

### Core Logic
- `/utils/clearancePricingConfig.ts` - Pricing calculation engine
- `/utils/clearancePricingService.ts` - Service wrapper

### Data Models
- `/components/quote/flows/clearance-removal/clearanceTypes.ts` - TypeScript interfaces

### UI Components
- `/components/quote/flows/clearance-removal/ClearanceStep1Address.tsx` - Address & disposal choice
- `/components/quote/flows/clearance-removal/ClearanceStep2Inventory.tsx` - Items selection
- `/components/quote/flows/clearance-removal/ClearanceStep3Pricing.tsx` - **Pricing display** ✨

### Admin
- `/components/admin/PricingRulesManager.tsx` - Configuration UI

---

## ✅ Features

- ✨ **Transparent pricing** with detailed breakdown
- 💰 **Flexible disposal modes** (fixed, per m³, or combined)
- 🎁 **Customer disposal credit** when they provide location
- 📦 **Service type multipliers** for different clearance types
- ♻️ **Disposal type multipliers** (recyclable discount, hazardous surcharge)
- 🏢 **Floor & parking surcharges**
- 📊 **Minimum charge** protection (£80)
- 🔄 **Real-time calculation** as data changes

---

## 🚀 Next Steps (Optional Enhancements)

1. **VAT Toggle** - Add 20% VAT option
2. **Discount Codes** - Promotional discount system
3. **Time-based Pricing** - Premium for urgent collections
4. **Distance-based Disposal** - Factor in disposal site distance
5. **Bulk Discounts** - Reduce rate for high volumes
6. **Seasonal Pricing** - Peak/off-peak rates

---

## 📝 Notes

- **All prices are in GBP (£)**
- **Prices exclude VAT** (can be added later)
- **Minimum charge:** £80.00
- **Default disposal mode:** `per_m3_only` (fairest for customers)
- **Work rate covers:** Labour, vehicle, fuel, insurance

---

**Last Updated:** January 2025  
**Version:** 1.0.0
