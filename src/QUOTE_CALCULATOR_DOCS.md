# Quote Calculator - Complete Documentation

## ✅ SINGLE SOURCE OF TRUTH

The Quote Calculator uses **ONLY** these sources for pricing:

1. **Service Types Configuration** (`/utils/serviceTypesService.ts`)
   - Base fee, minimum price
   - Price per m³ (volume pricing)
   - Price per mile (distance pricing)
   - Crew limits (min/max/default)
   - Feature toggles (useVolume, use_floors, etc.)

2. **Pricing Rules Configuration** (`/utils/pricingConfigService.ts`)
   - Packing factor (volume adjustment)
   - Safety margin (volume adjustment)
   - Handling speed (m³/hour/person)
   - Handling price per hour
   - Weight threshold and surcharge
   - Access charges (stairs, lift, parking)
   - Date surcharges (weekend, peak, end of month)

3. **Extras Catalog** (`/utils/extrasCatalogService.ts`)
   - Fixed price extras
   - Per-unit extras (with quantity)
   - Per-meter extras
   - Per-30-minutes extras
   - Percentage-of-booking extras

4. **Items Library** (`/utils/pricingEngine.ts` - `INVENTORY_METADATA`)
   - Volume per item (m³)
   - Weight per item (kg)
   - Handling time per item (minutes)
   - Special flags (fragile, requires disassembly)

## ❌ RATE CARDS NOT USED

**IMPORTANT:** Rate cards (`VEHICLE_TYPES` in `pricingEngine.ts`) are **DEPRECATED** and **NOT USED** for pricing calculations.

They are kept ONLY for:
- Backward compatibility with old saved quotes
- UI display (vehicle selection dropdown - cosmetic only)

**ALL PRICING RULES COME FROM SERVICE TYPES!**

---

## 🧮 PRICING ENGINE FORMULA

### Given Inputs:
```typescript
serviceTypeId: string         // e.g., 'house-move'
distanceMiles: number          // e.g., 25
crewSize: 1 | 2 | 3 | 4       // Number of crew
selectedItems: Array<{id, qty}> // Items from library
selectedExtras: Array<{id, qty}> // Extras from catalog
```

### Step-by-Step Calculation:

#### A. Volume Calculation
```typescript
// 1. Raw volume from Items Library
rawVolume = sum(item.volumeM3 * quantity)

// 2. Apply Pricing Rules adjustments (if configured)
adjustedVolume = rawVolume * rules.packingFactor
adjustedVolume = adjustedVolume * (1 + rules.safetyMarginPct)

// 3. Volume cost (ONLY if service.useVolume === true)
if (service.useVolume) {
  volumeCost = adjustedVolume * service.pricePerM3
} else {
  volumeCost = 0
}
```

#### B. Distance Cost
```typescript
distanceCost = distanceMiles * service.pricePerMile

// Long distance surcharge (over 50 miles)
if (distanceMiles > 50) {
  distanceCost += (distanceMiles - 50) * 0.5
}
```

#### C. Base Fee & Minimum Price
```typescript
baseFee = service.baseFee

// Core subtotal (before handling/access/extras)
subtotalCore = baseFee + volumeCost + distanceCost

// Apply minimum price
subtotalCore = max(subtotalCore, service.minPrice)
```

#### D. Handling Cost
```typescript
// Calculate handling time from Pricing Rules
handlingSpeed = rules.handlingSpeedM3PerHour  // e.g., 3 m³/hour/person
hours = adjustedVolume / (crewSize * handlingSpeed)

// Calculate handling cost
handlingPricePerHour = rules.handlingPricePerHour  // e.g., £25/hour
handlingCost = hours * handlingPricePerHour * crewSize

// Add to subtotal
subtotalWithHandling = subtotalCore + handlingCost
```

#### E. Access Charges & Surcharges
```typescript
// Stairs, lift, parking (from Pricing Rules)
accessCharges = 0
if (fromFloor > 0 && !fromLift) {
  accessCharges += fromFloor * rules.stairsWithoutLiftPerFloor
}
// ... similar for toFloor, parking, etc.

// Date surcharges (weekend, peak season, end of month)
dateSurcharges = 0
if (isWeekend) dateSurcharges += rules.weekendSurcharge
if (isPeakSeason) dateSurcharges += rules.peakSeasonSurcharge
if (isEndOfMonth) dateSurcharges += rules.endOfMonthSurcharge

// Flexible date discount
if (flexibleDate) dateSurcharges -= rules.flexibleDateDiscount

surchargesTotal = accessCharges + dateSurcharges
```

#### F. Extras
```typescript
extrasTotal = 0

for (extra in selectedExtras) {
  if (extra.pricingMode === 'fixed') {
    extraCost = extra.price
  } else if (extra.pricingMode === 'per_unit') {
    extraCost = extra.price * extra.quantity
  } else if (extra.pricingMode === 'percentage_of_booking') {
    extraCost = (subtotalWithHandling * extra.percentValue) / 100
    // Apply min/max caps if configured
    if (extra.minPrice) extraCost = max(extraCost, extra.minPrice)
    if (extra.maxPrice) extraCost = min(extraCost, extra.maxPrice)
  }
  
  extrasTotal += extraCost
}
```

#### G. Final Total
```typescript
total = subtotalWithHandling + surchargesTotal + extrasTotal

// Final minimum check
total = max(total, service.minPrice)
```

---

## 🛡️ HARD VALIDATION

### Before Quote Generation:

The Quote Calculator performs **HARD VALIDATION** via `/utils/quoteValidation.ts`:

```typescript
// 1. Service Type Validation
if (!serviceConfig) {
  ERROR: "Service Type is required"
}

// 2. Volume Pricing Validation
if (service.useVolume && service.pricePerM3 <= 0) {
  ERROR: "price_per_m3 must be > 0 when useVolume = true"
}

// 3. Distance Pricing Validation
if (service.pricePerMile <= 0) {
  ERROR: "price_per_mile must be > 0"
}

// 4. Crew Size Validation
if (crewSize < service.minCrew || crewSize > service.maxCrew) {
  ERROR: "Crew size outside allowed range"
}

// 5. Handling Configuration Validation
if (service.useVolume && rules.handlingSpeedM3PerHour <= 0) {
  ERROR: "handlingSpeedM3PerHour must be > 0"
}

// 6. Items Validation
if (selectedItems.length === 0) {
  ERROR: "At least one item must be selected"
}

// 7. NaN Prevention
// All numeric fields validated with Number.isFinite()
// Any invalid number defaults to 0 (with console warning)
```

**If validation fails → Quote generation is BLOCKED with error message!**

---

## 📊 COMPREHENSIVE BREAKDOWN

The Quote Calculator displays a **COMPLETE BREAKDOWN** showing:

### 1. Volume Calculation (Transparent)
```
📦 Volume Calculation
├─ Raw Volume (Items Library): 8.45 m³
├─ Packing Factor (20%): +1.69 m³
├─ Safety Margin (10%): +1.01 m³
├─ Final Adjusted Volume: 11.15 m³
└─ Volume Cost: 11.15 m³ × £12/m³ = £133.80
   SOURCE: Service Type + Pricing Rules
```

### 2. Base Fee
```
Base Fee: £0.00
SOURCE: Service Type (House Move)
```

### 3. Distance Cost
```
Distance Cost: 25 miles × £2.50/mile = £62.50
SOURCE: Service Type
```

### 4. Crew Cost
```
Crew Cost (2 people): £100.00
SOURCE: Pricing Rules
```

### 5. Handling Cost (Detailed)
```
⏱️ Handling & Loading
├─ Estimated Time: 1.86 hours
│  (11.15 m³ ÷ (2 crew × 3 m³/h/person))
├─ Rate per Hour per Person: £25/hour
└─ Handling Cost: 1.86h × £25/h × 2 crew = £93.00
   SOURCE: Pricing Rules
```

### 6. Weight Surcharge (if any)
```
Weight Surcharge: £15.00
(Heavy items over 500kg threshold)
SOURCE: Pricing Rules
```

### 7. Special Handling Fees
```
🛠️ Special Handling
├─ Furniture Disassembly/Assembly: £50.00
└─ Fragile Items Handling: £20.00
   SOURCE: Pricing Rules
```

### 8. Access Charges
```
Access Charges: £45.00
(Stairs, lift, parking, etc.)
SOURCE: Pricing Rules
```

### 9. Date Surcharges
```
Date Surcharges: £30.00
(Weekend, peak season, end of month)
SOURCE: Pricing Rules
```

### 10. Extras
```
✨ Extras & Additional Services
├─ Packing Service (Fixed): £250.00
├─ Storage (1 Month): £100.00
└─ Insurance Premium: £75.00
   SOURCE: Extras Catalog
   Total: £425.00
```

### 11. Subtotal
```
Subtotal: £954.30
```

### 12. Minimum Charge (if applied)
```
⚠️ Minimum Charge Applied
Subtotal (£180.00) is below minimum charge of £280.00
SOURCE: Service Type (House Move)
```

### 13. Final Total
```
TOTAL: £954.30
```

### 14. Estimated Time
```
⏱️ Estimated Time: 3.5 hours total
Handling: 1.9h • Travel: 1.6h
SOURCE: Calculated from volume, crew size, and distance
```

### 15. Validation Notice
```
✅ Pricing Sources Verified
• Service Type: House Move
• Items Library: 15 items
• Pricing Rules: Global configuration applied
• Extras Catalog: 3 extras selected
⛔ Rate Cards: NOT USED
```

---

## 🎬 ACTION BUTTONS

After quote is generated, user can:

1. **Edit & Recalculate** (Purple)
   - Modify items, extras, distance, crew size
   - Click to regenerate quote without losing work
   - Quote recalculates with new parameters

2. **Save Quote** (Indigo)
   - Creates quote record in database
   - Generates unique quote number (QUO-2024-XXX)
   - Status: "generated"
   - Can be updated later

3. **Convert to Job** (Green)
   - Creates job from quote
   - Sends to "Available Jobs" list
   - Status: "pending_acceptance"
   - Ready for driver assignment

---

## 📁 FILE STRUCTURE

```
/components/admin/
  QuoteCalculatorNew.tsx          # Main quote calculator UI
  QuoteBreakdownDetailed.tsx      # Comprehensive breakdown component

/utils/
  pricingEngine.ts                # Core pricing calculation logic
  serviceTypesService.ts          # Service types configuration
  pricingConfigService.ts         # Pricing rules configuration
  extrasCatalogService.ts         # Extras catalog
  quoteValidation.ts              # Hard validation before generation
  quotesService.ts                # Quote CRUD operations
  jobsService.ts                  # Job creation from quotes
```

---

## 🚫 FORBIDDEN PRACTICES

**NEVER:**
- Use `VEHICLE_TYPES` rate cards for pricing
- Use `vehiclePricePerMile` from vehicle config
- Use `vehicleBaseFee` from vehicle config
- Allow silent NaN failures (always validate)
- Skip validation checks
- Calculate price without service type config

**ALWAYS:**
- Use `serviceConfig.price_per_mile` for distance pricing
- Use `serviceConfig.price_per_m3` for volume pricing
- Use `serviceConfig.min_price` for minimum charge
- Use `serviceConfig.base_price` for base fee
- Validate inputs before calling `calculatePrice()`
- Show complete breakdown with sources

---

## 🧪 TESTING CHECKLIST

### Before Quote Generation:
- [ ] Service type selected?
- [ ] Items added (at least 1)?
- [ ] Distance > 0?
- [ ] Crew size valid (1-4)?
- [ ] Service config has valid `price_per_m3` if `useVolume = true`?
- [ ] Service config has valid `price_per_mile`?

### After Quote Generation:
- [ ] Total price > 0?
- [ ] Total price is not NaN?
- [ ] Breakdown shows all components?
- [ ] Volume calculation transparent?
- [ ] Handling cost detailed?
- [ ] Sources clearly indicated?
- [ ] Minimum charge applied correctly?

### Quote Actions:
- [ ] Edit & Recalculate works?
- [ ] Save Quote creates DB record?
- [ ] Convert to Job creates job?
- [ ] Toast messages show on success/error?

---

## 📖 EXAMPLE QUOTE

**Input:**
- Service: House Move
- Distance: 25 miles
- Crew: 2 people
- Items: 15 items (8.45 m³ raw volume)
- Extras: Packing Service, Insurance

**Calculation:**
```
Raw Volume: 8.45 m³
Packing Factor (20%): +1.69 m³ → 10.14 m³
Safety Margin (10%): +1.01 m³ → 11.15 m³

Volume Cost: 11.15 × £12 = £133.80
Distance: 25 × £2.50 = £62.50
Base Fee: £0
Handling: 1.86h × £25 × 2 crew = £93.00
Crew: £100
Extras: £325
Subtotal: £714.30

Minimum check: £714.30 > £280 ✓
TOTAL: £714.30
```

---

**Last Updated:** January 2026  
**Version:** 2.0 (Single Source of Truth)
