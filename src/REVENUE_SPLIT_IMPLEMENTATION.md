# 💰 REVENUE SPLIT SYSTEM - IMPLEMENTATION GUIDE

**Date:** January 19, 2026  
**Feature:** Driver Commission & Company Revenue Split for Extra Items  
**Status:** ✅ **FULLY IMPLEMENTED**

---

## 🎯 BUSINESS REQUIREMENT

When drivers add extra items ON-SITE (items customers forgot to mention), the payment is split between:
- 🚚 **Driver Commission** (default: 70%)
- 🏢 **Company Revenue** (default: 30%)

This incentivizes drivers to upsell extra items while ensuring the company gets its fair share.

---

## 📐 FORMULA

### **Customer Payment Calculation:**
```typescript
// Step 1: Calculate item price
basePrice = item.basePrice × quantity
surcharge = basePrice × item.lateAdditionSurcharge
subtotal = basePrice + surcharge
finalPrice = subtotal × config.lateAdditionMultiplier
finalPrice = MAX(finalPrice, config.minimumExtraCharge)

// Step 2: Apply cash discount (if paying cash)
if (payingCash) {
  cashDiscount = finalPrice × config.cashPaymentDiscount
  totalCustomerPaid = finalPrice - cashDiscount
} else {
  totalCustomerPaid = finalPrice
}

// Step 3: Split revenue
driverEarnings = totalCustomerPaid × config.driverCommissionPercentage
companyRevenue = totalCustomerPaid × config.companyRevenuePercentage

// Validation: driverCommissionPercentage + companyRevenuePercentage MUST = 1.0 (100%)
```

---

## 📊 EXAMPLE CALCULATIONS

### **Example 1: Single Item (Card Payment)**
```
Item: 2-Seater Sofa
Base Price: £100
Late Surcharge: 20%
Global Multiplier: 1.2 (+20%)
Quantity: 1
Payment Method: Card

Step 1: Calculate price
baseTotal = £100 × 1 = £100
surcharge = £100 × 0.20 = £20
subtotal = £100 + £20 = £120
finalPrice = £120 × 1.2 = £144
finalPrice = MAX(£144, £25) = £144

Step 2: No cash discount
totalCustomerPaid = £144

Step 3: Revenue split (70% / 30%)
driverEarnings = £144 × 0.70 = £100.80
companyRevenue = £144 × 0.30 = £43.20

✅ RESULT:
Customer pays: £144.00
Driver gets:   £100.80 (70%)
Company gets:  £43.20  (30%)
```

### **Example 2: Single Item (Cash Payment)**
```
Same item, but customer pays CASH

Step 1: Calculate price
finalPrice = £144 (same as above)

Step 2: Apply cash discount (5%)
cashDiscount = £144 × 0.05 = £7.20
totalCustomerPaid = £144 - £7.20 = £136.80

Step 3: Revenue split (70% / 30%)
driverEarnings = £136.80 × 0.70 = £95.76
companyRevenue = £136.80 × 0.30 = £41.04

✅ RESULT:
Customer pays: £136.80 (saved £7.20 with cash!)
Driver gets:   £95.76  (70% of discounted amount)
Company gets:  £41.04  (30% of discounted amount)

💡 NOTE: Driver loses £5.04 compared to card payment (£100.80 - £95.76)
         But customer is happier, so more likely to tip!
```

### **Example 3: Multiple Items**
```
Items:
- 2× Chair (£40, 15% surcharge) = £55.20 each = £110.40 total
- 1× Washing Machine (£70, 20% surcharge) = £100.80
- 3× Small Box (£5, 10% surcharge) = £6.60 each, BUT £25 minimum = £25 total

Total before cash: £110.40 + £100.80 + £25.00 = £236.20

Customer pays CASH:
cashDiscount = £236.20 × 0.05 = £11.81
totalCustomerPaid = £236.20 - £11.81 = £224.39

Revenue split (70% / 30%):
driverEarnings = £224.39 × 0.70 = £157.07
companyRevenue = £224.39 × 0.30 = £67.32

✅ RESULT:
Customer pays: £224.39
Driver gets:   £157.07 (70%)
Company gets:  £67.32  (30%)
```

---

## 🔧 IMPLEMENTATION DETAILS

### **1. Data Structure**

#### **DriverPricingConfig Interface:**
```typescript
export interface DriverPricingConfig {
  items: DriverItemPrice[];
  lateAdditionMultiplier: number;
  minimumExtraCharge: number;
  cashPaymentDiscount: number;
  
  // 💰 REVENUE SPLIT (NEW)
  driverCommissionPercentage: number; // e.g., 0.70 = 70%
  companyRevenuePercentage: number;   // e.g., 0.30 = 30%
  
  lastUpdated?: string;
}
```

#### **DEFAULT CONFIGURATION:**
```typescript
export const DEFAULT_DRIVER_PRICING: DriverPricingConfig = {
  lateAdditionMultiplier: 1.2,        // +20%
  minimumExtraCharge: 25,             // £25
  cashPaymentDiscount: 0.05,          // 5%
  driverCommissionPercentage: 0.70,   // 70% to driver
  companyRevenuePercentage: 0.30,     // 30% to company
  items: [ /* 38 pre-defined items */ ],
};
```

### **2. Calculation Function**

#### **MultiItemCalculation Interface:**
```typescript
export interface MultiItemCalculation {
  items: ExtraItemCalculation[];
  totalBeforeCash: number;
  cashDiscount?: number;
  totalAfterCash?: number;
  
  // 💰 REVENUE SPLIT (NEW)
  revenueSplit?: {
    totalCustomerPaid: number;  // What customer actually paid
    driverEarnings: number;      // What driver receives
    companyRevenue: number;      // What company receives
    driverPercentage: number;    // % that driver gets
    companyPercentage: number;   // % that company gets
  };
}
```

#### **calculateMultipleExtraItems() Function:**
```typescript
export function calculateMultipleExtraItems(
  selections: { itemId: string; quantity: number }[],
  config: DriverPricingConfig = DEFAULT_DRIVER_PRICING,
  payingCash: boolean = false
): MultiItemCalculation {
  // ... calculate items and totals ...
  
  // Calculate revenue split
  const totalCustomerPaid = payingCash ? (totalAfterCash || totalBeforeCash) : totalBeforeCash;
  const driverEarnings = totalCustomerPaid * config.driverCommissionPercentage;
  const companyRevenue = totalCustomerPaid * config.companyRevenuePercentage;
  
  return {
    items,
    totalBeforeCash,
    cashDiscount,
    totalAfterCash,
    revenueSplit: {
      totalCustomerPaid,
      driverEarnings,
      companyRevenue,
      driverPercentage: config.driverCommissionPercentage,
      companyPercentage: config.companyRevenuePercentage,
    },
  };
}
```

---

## 🎨 ADMIN UI FEATURES

### **Revenue Split Configuration Panel**

Located in: `Admin Panel → Pricing & Quotes → 🚚 Driver Pricing → Global Settings → Revenue Split`

#### **Features:**
1. ✅ **Driver Commission Input**
   - Number input (0.00 - 1.00)
   - Live percentage display (e.g., 70%)
   - Description: "Driver receives X% of every extra item sale"

2. ✅ **Company Revenue Input**
   - Number input (0.00 - 1.00)
   - Live percentage display (e.g., 30%)
   - Description: "Company receives X% of every extra item sale"
   - **Auto-sync:** When you change one, the other updates automatically (must sum to 100%)

3. ✅ **Validation Alert**
   - Red warning if percentages don't sum to 100%
   - Prevents saving invalid configuration

4. ✅ **Example Calculation**
   - Shows live preview with £100 sample
   - Displays: Customer Pays | Driver Gets | Company Gets
   - Updates instantly when percentages change

#### **UI Screenshot (Text Description):**
```
┌─────────────────────────────────────────────────────────────┐
│ 💰 Revenue Split Configuration                             │
│ How extra item payments are divided between driver & company│
├─────────────────────────────────────────────────────────────┤
│ 🚚 Driver Commission     │  🏢 Company Revenue              │
│ [0.70]  70%              │  [0.30]  30%                     │
│ Driver receives 70% of   │  Company receives 30% of         │
│ every extra item sale    │  every extra item sale           │
├─────────────────────────────────────────────────────────────┤
│ 💡 Example Split:                                           │
│ Customer Pays: £100.00                                      │
│ Driver Gets:   £70.00                                       │
│ Company Gets:  £30.00                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 DRIVER MOBILE UI (NOT YET IMPLEMENTED)

### **Future Implementation:**

When driver adds extra item, show:

```
┌──────────────────────────────┐
│ Add Extra Item               │
├──────────────────────────────┤
│ Item: Washing Machine        │
│ Quantity: 1                  │
│                              │
│ Customer Pays: £100.80       │
│                              │
│ YOUR Earnings: £70.56 💰     │
│ Company Cut:   £30.24        │
│                              │
│ [ Pay Cash ] [ Pay Card ]    │
│                              │
│ 💡 Cash discount: -£5.04     │
│    New total: £95.76         │
│    Your cut: £67.03          │
└──────────────────────────────┘
```

This transparency helps drivers understand their incentive structure!

---

## 🔒 BACKEND INTEGRATION

### **Storage:**
- Config stored in KV: `driver_pricing_config`
- Includes `driverCommissionPercentage` and `companyRevenuePercentage`

### **API Endpoints:**
```typescript
// GET /driver-pricing-config
// Returns config with revenue split settings

// POST /driver-pricing-config
// Saves config with revenue split settings
// Validates: driverCommission + companyRevenue = 1.0

// POST /driver/add-extra-items
// Should also save revenueSplit data for audit
```

### **Job Update Structure:**
```typescript
{
  jobId: "12345",
  extraItems: [
    { itemId: "washing-machine", quantity: 1 }
  ],
  totalExtraCharge: 100.80,
  paymentMethod: "cash",
  driverId: "DRIVER001",
  
  // NEW: Revenue split breakdown
  revenueSplit: {
    totalCustomerPaid: 95.76,   // After cash discount
    driverEarnings: 67.03,      // Driver commission
    companyRevenue: 28.73,      // Company cut
    driverPercentage: 0.70,
    companyPercentage: 0.30
  }
}
```

---

## 📈 ANALYTICS & REPORTING

### **Metrics to Track:**

1. **Driver Performance:**
   - Total extra items sold
   - Total revenue generated
   - Total driver earnings
   - Average item value
   - Cash vs card payment ratio

2. **Company Revenue:**
   - Total company revenue from extras
   - Revenue split breakdown
   - Top-performing drivers
   - Most profitable items

3. **Customer Behavior:**
   - Most forgotten items
   - Cash payment adoption rate
   - Average order value for extras

### **Example Report:**
```
Driver Performance Report - January 2026
Driver: John Smith (DRIVER001)

Extra Items Sold: 47 items
Total Customer Payments: £2,450.00
  - Cash:  £1,350.00 (55%)
  - Card:  £1,100.00 (45%)

Driver Earnings: £1,715.00 (70%)
Company Revenue: £735.00  (30%)

Top Items:
1. Washing Machine (8x) - £806.40
2. 2-Seater Sofa (5x) - £720.00
3. Fridge-Freezer (4x) - £461.00

Average Order Value: £52.13
Best Day: Jan 15 (£340.00)
```

---

## ⚖️ BUSINESS CONSIDERATIONS

### **Why 70/30 Split?**

**Driver Gets 70%:**
- 💪 Strong incentive to upsell
- 🚚 Driver does physical labor on-site
- 💼 Driver handles customer interaction
- 📱 Driver uses their phone/data
- ⏱️ Extra time spent = extra pay

**Company Gets 30%:**
- 🏢 Covers admin overhead
- 📊 Platform maintenance
- 💳 Payment processing fees
- 📞 Customer support
- 🛡️ Insurance costs
- 📈 Marketing & branding

### **Alternative Split Options:**

| Split | Driver% | Company% | Use Case |
|-------|---------|----------|----------|
| **Aggressive** | 80% | 20% | High competition, need to attract drivers |
| **Standard** | 70% | 30% | Balanced incentive (DEFAULT) |
| **Conservative** | 60% | 40% | Mature market, high company costs |
| **Franchise** | 50% | 50% | Franchise model, shared risk |

### **Dynamic Splits (Future Enhancement):**

Consider adjusting split based on:
- 📅 Time of day (weekends = higher driver %)
- 📦 Item value (high-value items = lower driver %)
- 🌟 Driver performance tier (top performers = higher %)
- 🚨 Urgency (last-minute items = higher driver %)

---

## ✅ VALIDATION RULES

### **Configuration Validation:**
```typescript
// MUST PASS before saving:
driverCommissionPercentage + companyRevenuePercentage === 1.0

// Both percentages must be between 0 and 1
driverCommissionPercentage >= 0 && driverCommissionPercentage <= 1
companyRevenuePercentage >= 0 && companyRevenuePercentage <= 1

// Recommended ranges (warnings, not errors):
driverCommissionPercentage >= 0.50 // Driver should get at least 50%
companyRevenuePercentage >= 0.20   // Company should get at least 20%
```

### **UI Validation:**
```typescript
// Real-time validation in admin UI:
if (Math.abs((driverPct + companyPct) - 1.0) > 0.01) {
  showError("Percentages must sum to 100%!");
  disableSaveButton();
}
```

---

## 🎯 TESTING SCENARIOS

### **Test Case 1: Standard Split**
```
Config: 70% driver / 30% company
Item: £100 (card)
Expected:
- Customer pays: £100.00
- Driver gets: £70.00
- Company gets: £30.00
✅ PASS
```

### **Test Case 2: Cash Discount Impact**
```
Config: 70% driver / 30% company
Item: £100 (cash, 5% discount)
Expected:
- Customer pays: £95.00
- Driver gets: £66.50 (70% of £95)
- Company gets: £28.50 (30% of £95)
✅ PASS
```

### **Test Case 3: Multiple Items**
```
Config: 70% driver / 30% company
Items: £144 + £100.80 + £25 = £269.80 (card)
Expected:
- Customer pays: £269.80
- Driver gets: £188.86
- Company gets: £80.94
✅ PASS
```

### **Test Case 4: Validation Error**
```
Config: 80% driver / 30% company
Expected:
- Error: "Percentages must sum to 100%"
- Save button disabled
✅ PASS
```

---

## 🚀 FUTURE ENHANCEMENTS

1. **Tiered Commission Structure**
   ```typescript
   // Example: Higher performance = higher commission
   if (monthlyExtrasSold > 100) {
     driverCommission = 0.75; // 75%
   } else if (monthlyExtrasSold > 50) {
     driverCommission = 0.70; // 70%
   } else {
     driverCommission = 0.65; // 65%
   }
   ```

2. **Bonus Pools**
   ```typescript
   // Example: Company keeps 30%, redistributes 5% as monthly bonus
   companyRevenue = 25%;
   bonusPool = 5%;
   ```

3. **Tax Compliance**
   - Auto-generate 1099/tax forms for drivers
   - Track earnings for tax reporting
   - Export to accounting software

4. **Driver Payouts**
   - Daily/weekly/monthly payout schedules
   - Direct bank transfer integration
   - PayPal/Stripe Connect support

---

## 📊 SUMMARY

### **Implementation Status:**
- ✅ Data structure (DriverPricingConfig)
- ✅ Calculation engine (calculateMultipleExtraItems)
- ✅ Admin UI (revenue split panel)
- ✅ Backend storage (KV store)
- ✅ API endpoints (GET/POST config)
- ✅ Validation (percentage sum check)
- ❌ Driver mobile UI (future)
- ❌ Payout system (future)

### **Default Configuration:**
- Driver Commission: **70%**
- Company Revenue: **30%**
- Can be changed by admin anytime
- Changes apply to all NEW transactions

### **Key Benefits:**
- 💰 Fair revenue sharing
- 🚀 Driver incentive to upsell
- 📊 Transparent calculation
- ⚙️ Fully configurable
- 🔒 Backend validation

---

**Documentation Complete!**  
**Status:** ✅ READY FOR USE  
**Last Updated:** January 19, 2026
