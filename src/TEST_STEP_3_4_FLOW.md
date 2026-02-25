# ✅ TESTING STEP 3 & STEP 4 - STANDARD vs PREMIUM

## 🎯 TEST SCENARIOS

### **TEST 1: STANDARD PACKAGE FLOW**

#### Step 3 - Package Selection:
1. ✅ Navigate to Step 3 (after completing Steps 1-2)
2. ✅ See 2 packages displayed side-by-side
3. ✅ Click on **Standard Package** card
4. ✅ Verify:
   - Card has blue border + ring effect
   - Button shows "Selected ✓"
   - Features show: 6 ✅ included, 4 ❌ not included
5. ✅ Click "Continue to Contact Details"

#### Step 4 - Date & Extras (Standard):
1. ✅ Verify sections displayed:
   - ✅ "Choose Your Move Date" (visible)
   - ✅ "Optional Extras" (visible - 2 extras)
   - ✅ "Special Requirements" (visible)
2. ✅ Select a date (tomorrow or later)
3. ✅ Select a time slot (e.g., "8am - 10am")
4. ✅ Click on "Furniture Disassembly & Reassembly" (+£85)
   - Verify: Card turns purple with checkmark
   - Verify: Price summary shows "+£85.00"
5. ✅ Click on "Enhanced Protection" (+£45)
   - Verify: Card turns purple with checkmark
   - Verify: Price summary shows "+£130.00 total extras"
6. ✅ Check Package Summary (right sidebar):
   - Base price: £295.00
   - Optional extras: +£130.00
   - **Total: £425.00**
7. ✅ Add special requirements text
8. ✅ Click "Continue to Contact Details"

**Expected Result:**
- ✅ No "Included Services" section
- ✅ No "Need Storage?" section
- ✅ Only "Optional Extras" visible
- ✅ Price = Base + Extras

---

### **TEST 2: PREMIUM PACKAGE FLOW**

#### Step 3 - Package Selection:
1. ✅ Navigate to Step 3 (after completing Steps 1-2)
2. ✅ Click on **Premium Package** card
3. ✅ Verify:
   - Card has emerald border + ring effect
   - "MOST POPULAR" badge visible
   - Button shows "Selected ✓"
   - All 10 features show ✅ checkmarks
4. ✅ Click "Continue to Contact Details"

#### Step 4 - Date & Extras (Premium):
1. ✅ Verify sections displayed:
   - ✅ "Choose Your Move Date" (visible)
   - ✅ "Included Services" (visible - 10 services in grid)
   - ✅ "Need Storage?" (visible)
   - ✅ "Special Requirements" (visible)
   - ❌ "Optional Extras" (NOT visible!)
2. ✅ Select a date (tomorrow or later)
3. ✅ Select a time slot
4. ✅ Review "Included Services" grid:
   - 10 services displayed in 2 columns
   - Each has emoji icon + green background
   - Example: "🚚 Expert packing, loading & transport crew"
5. ✅ Click on "Need Storage?" card
   - Verify: Card turns blue with checkmark
   - Verify: Shows "💰 Save 10% on your move (£42.78)"
   - Verify: Price summary shows "-£42.78 discount"
6. ✅ Check Package Summary (right sidebar):
   - Base price: £427.75
   - Storage discount: -£42.78
   - **Total: £384.97**
7. ✅ Add special requirements text
8. ✅ Click "Continue to Contact Details"

**Expected Result:**
- ✅ "Included Services" section visible
- ✅ "Need Storage?" section visible
- ❌ "Optional Extras" section NOT visible
- ✅ Price = Base - Storage Discount (if selected)

---

## 🎨 VISUAL CHECKS

### Standard Package (Step 4):
```
✅ Purple gradient header for "Optional Extras"
✅ 2 extra cards with purple accent when selected
✅ Purple pricing on right sidebar for extras
```

### Premium Package (Step 4):
```
✅ Emerald gradient header for "Included Services"
✅ Grid of 10 services with emoji icons
✅ Blue gradient header for "Need Storage?"
✅ Storage discount in green on right sidebar
```

---

## 💾 DATA PERSISTENCE CHECKS

### After Step 3:
```tsx
data.pricing = {
  basePrice: 295.00 or 427.75,
  extras: [],
  totalPrice: 295.00 or 427.75,
  packageType: 'standard' or 'premium'
}
```

### After Step 4 (Standard):
```tsx
data.date = '2025-01-25'
data.moveTime = '08:00-10:00'
data.specialRequirements = 'text...'
data.pricing = {
  basePrice: 295.00,
  extras: [
    { id: 'disassembly', name: '...', price: 85 },
    { id: 'protection-plus', name: '...', price: 45 }
  ],
  totalPrice: 425.00,
  packageType: 'standard'
}
```

### After Step 4 (Premium):
```tsx
data.date = '2025-01-25'
data.moveTime = '08:00-10:00'
data.specialRequirements = 'text...'
data.needsStorage = true
data.pricing = {
  basePrice: 427.75,
  extras: [],
  totalPrice: 384.97, // (427.75 - 42.78)
  packageType: 'premium'
}
```

---

## 🔍 CONDITIONAL LOGIC CHECKS

### In Step4DateTime.tsx:
```tsx
const isPremium = data.pricing?.packageType === 'premium';

// Standard shows:
{!isPremium && <OptionalExtras />}

// Premium shows:
{isPremium && (
  <>
    <IncludedServices />
    <StorageOption />
  </>
)}

// Both show:
<DateSelection />
<SpecialRequirements />
```

---

## ⚡ PRICING CALCULATIONS

### Standard:
```tsx
basePrice = 295.00
extrasTotal = 85 + 45 = 130
storageDiscount = 0
totalPrice = 295 + 130 - 0 = 425.00 ✅
```

### Premium (no storage):
```tsx
basePrice = 427.75
extrasTotal = 0
storageDiscount = 0
totalPrice = 427.75 - 0 = 427.75 ✅
```

### Premium (with storage):
```tsx
basePrice = 427.75
extrasTotal = 0
storageDiscount = 427.75 * 0.1 = 42.78
totalPrice = 427.75 - 42.78 = 384.97 ✅
```

---

## ✅ SUCCESS CRITERIA

- [ ] Standard package shows Optional Extras
- [ ] Premium package shows Included Services + Storage
- [ ] Optional Extras NOT visible for Premium
- [ ] Storage option NOT visible for Standard
- [ ] Pricing calculates correctly for both
- [ ] Data saves to localStorage correctly
- [ ] Can navigate back to Step 3
- [ ] Can navigate forward to Step 5
- [ ] Right sidebar updates in real-time
- [ ] Date validation works (min: tomorrow)

---

## 🚀 MANUAL TESTING STEPS

1. Start fresh quote flow
2. Complete Step 1 (addresses)
3. Complete Step 2 (select items)
4. Step 3: Select Standard → Verify Step 4 layout
5. Go back to Step 3
6. Step 3: Select Premium → Verify Step 4 layout
7. Verify all conditional rendering works
8. Verify pricing calculations
9. Complete flow and check localStorage

---

**All tests should PASS for both packages!** ✅
