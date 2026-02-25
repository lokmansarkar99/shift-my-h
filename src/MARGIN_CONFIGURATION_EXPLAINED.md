# 📊 MARGIN CONFIGURATION SYSTEM - COMPLETE GUIDE

**Date:** January 19, 2026  
**Component:** `/components/admin/MarginConfiguration.tsx`  
**Purpose:** Configure automatic driver/partner pricing from customer prices  
**Status:** ✅ FULLY FUNCTIONAL

---

## 🎯 WHAT IS MARGIN CONFIGURATION?

**Margin Configuration** is a system that automatically calculates how much drivers/partners earn from jobs by applying a **company margin** to the customer price.

### **🔑 KEY CONCEPT:**

```
Customer Price = What customer pays
Company Margin = Company's cut
Driver Price = What driver earns

Formula:
Driver Price = Customer Price - Company Margin
```

---

## 🏗️ SYSTEM ARCHITECTURE

### **Two Pricing Modes:**

1. **✅ Use Separate Driver Rate Cards** (DEFAULT)
   - Driver pricing calculated from INDEPENDENT driver rate cards
   - Driver rate cards are COMPLETELY SEPARATE from customer rate cards
   - No margin calculation needed (driver rates are pre-defined)
   - **Example:** Customer pays £150 (from customer rate card), Driver gets £120 (from driver rate card)

2. **📊 Calculate from Customer Price Minus Margin**
   - Driver pricing calculated by subtracting margin from customer price
   - Margin can be: Percentage, Fixed, or Hybrid
   - **Example:** Customer pays £150, Company takes 30% (£45), Driver gets £105

---

## ⚙️ MARGIN TYPES

### **1️⃣ PERCENTAGE MARGIN** (Default: 30%)

#### **How it works:**
```typescript
Company Margin = Customer Price × Percentage
Driver Price = Customer Price - Company Margin
```

#### **Example:**
```
Customer Price: £150
Percentage Margin: 30%

Company Margin = £150 × 0.30 = £45
Driver Price = £150 - £45 = £105

✅ RESULT:
Customer pays: £150
Company gets:  £45 (30%)
Driver gets:   £105 (70%)
```

#### **Pros:**
- ✅ Scales with job value
- ✅ Fair for expensive jobs (company gets more)
- ✅ Fair for cheap jobs (company gets less)

#### **Cons:**
- ❌ Company might get very little on cheap jobs
- ❌ Driver might get very little on cheap jobs if % is high

---

### **2️⃣ FIXED MARGIN** (Default: £15)

#### **How it works:**
```typescript
Company Margin = Fixed Amount (e.g., £15)
Driver Price = Customer Price - Fixed Margin
```

#### **Example:**
```
Customer Price: £150
Fixed Margin: £15

Company Margin = £15
Driver Price = £150 - £15 = £135

✅ RESULT:
Customer pays: £150
Company gets:  £15 (10%)
Driver gets:   £135 (90%)
```

#### **Pros:**
- ✅ Predictable company revenue
- ✅ Simple to understand
- ✅ Driver gets higher % on expensive jobs

#### **Cons:**
- ❌ Company gets same amount regardless of job complexity
- ❌ Might be unfair for very cheap jobs (£15 margin on £50 job = 30%!)

---

### **3️⃣ HYBRID MARGIN** (Percentage + Minimum)

#### **How it works:**
```typescript
Percentage Margin = Customer Price × Percentage
Minimum Margin = Fixed Amount (e.g., £10)
Company Margin = MAX(Percentage Margin, Minimum Margin)
Driver Price = Customer Price - Company Margin
```

#### **Example 1: Expensive Job**
```
Customer Price: £150
Percentage Margin: 20%
Minimum Margin: £10

Percentage Margin = £150 × 0.20 = £30
Minimum Margin = £10
Company Margin = MAX(£30, £10) = £30 ✅

Driver Price = £150 - £30 = £120

✅ RESULT:
Customer pays: £150
Company gets:  £30 (20%)
Driver gets:   £120 (80%)
```

#### **Example 2: Cheap Job**
```
Customer Price: £40
Percentage Margin: 20%
Minimum Margin: £10

Percentage Margin = £40 × 0.20 = £8
Minimum Margin = £10
Company Margin = MAX(£8, £10) = £10 ✅

Driver Price = £40 - £10 = £30

✅ RESULT:
Customer pays: £40
Company gets:  £10 (25%)
Driver gets:   £30 (75%)
```

#### **Pros:**
- ✅ Best of both worlds
- ✅ Company guaranteed minimum revenue
- ✅ Scales with expensive jobs
- ✅ Protects driver on cheap jobs

#### **Cons:**
- ❌ Slightly more complex
- ❌ Driver gets varying percentages

---

## 📊 COMPARISON TABLE

| Job Price | Percentage (30%) | Fixed (£15) | Hybrid (20% or min £10) |
|-----------|------------------|-------------|-------------------------|
| **£50** | Driver: £35 (70%) | Driver: £35 (70%) | Driver: £40 (80%) ✅ |
| | Company: £15 (30%) | Company: £15 (30%) | Company: £10 (20%) |
| **£100** | Driver: £70 (70%) | Driver: £85 (85%) ✅ | Driver: £80 (80%) |
| | Company: £30 (30%) | Company: £15 (15%) | Company: £20 (20%) |
| **£150** | Driver: £105 (70%) | Driver: £135 (90%) ✅ | Driver: £120 (80%) |
| | Company: £45 (30%) | Company: £15 (10%) | Company: £30 (20%) |
| **£300** | Driver: £210 (70%) | Driver: £285 (95%) ✅ | Driver: £240 (80%) |
| | Company: £90 (30%) | Company: £15 (5%) | Company: £60 (20%) |

**Observations:**
- 📈 **Percentage:** Consistent company % (30%), but company gets more on expensive jobs
- 💵 **Fixed:** Driver gets higher % on expensive jobs, company gets flat £15
- ⚖️ **Hybrid:** Balanced approach, company gets 20-25% depending on job value

---

## 🎨 UI INTERFACE

### **Configuration Panel:**

```
┌────────────────────────────────────────────────────────┐
│ Margin Configuration                                   │
│ Configure automatic driver/partner pricing             │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ☑ Use Separate Driver Rate Cards                      │
│   If enabled, driver pricing calculated from driver   │
│   rate cards. If disabled, calculated from customer   │
│   price minus margin.                                  │
│                                                        │
│ ─────────────────────────────────────────────────────  │
│                                                        │
│ Margin Type                                            │
│                                                        │
│ ○ Percentage Margin                                    │
│   Platform takes a percentage of customer price        │
│   → Percentage: [30] %                                 │
│                                                        │
│ ○ Fixed Margin                                         │
│   Platform takes a fixed amount per job               │
│   → Fixed: £ [15]                                      │
│                                                        │
│ ● Hybrid (% + Minimum)                                 │
│   Use whichever margin is higher                       │
│   → Percentage: [20] %                                 │
│   → Minimum: £ [10]                                    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### **Live Preview Panel:**

```
┌────────────────────────────────┐
│ Live Example                   │
├────────────────────────────────┤
│ Customer Price                 │
│ £150.00                        │
├────────────────────────────────┤
│ Platform Margin                │
│ £30.00 (20.0%)                 │
├────────────────────────────────┤
│ Driver Earnings                │
│ £120.00                        │
└────────────────────────────────┘
```

---

## 🔄 HOW IT WORKS (STEP-BY-STEP)

### **Scenario 1: Using Driver Rate Cards (DEFAULT)**

```
Step 1: Customer requests quote
  → System uses CUSTOMER rate cards
  → Customer Price = £150

Step 2: Driver sees job
  → System uses DRIVER rate cards
  → Driver Price = £120 (from driver rate cards)

Step 3: Job assigned
  → Customer pays: £150
  → Driver receives: £120
  → Company keeps: £30 (automatically calculated)

✅ NO MARGIN CONFIGURATION USED
   Prices come from separate rate cards!
```

### **Scenario 2: Using Margin Configuration**

```
Step 1: Customer requests quote
  → System uses CUSTOMER rate cards
  → Customer Price = £150

Step 2: Calculate driver price
  → Margin Type: Percentage (30%)
  → Company Margin = £150 × 0.30 = £45
  → Driver Price = £150 - £45 = £105

Step 3: Job assigned
  → Customer pays: £150
  → Driver receives: £105
  → Company keeps: £45

✅ MARGIN CONFIGURATION USED
   Driver price calculated from customer price!
```

---

## 🎯 USE CASES

### **When to use DRIVER RATE CARDS:**

✅ **Use when:**
- You have different pricing for drivers vs customers
- Driver costs are independent (fuel, vehicle type, etc.)
- You want full control over driver pricing
- Regional pricing differences (driver in London vs driver in Edinburgh)

❌ **Don't use when:**
- Driver pricing should mirror customer pricing
- You want simple margin-based calculation
- Managing two rate cards is too complex

---

### **When to use PERCENTAGE MARGIN:**

✅ **Use when:**
- You want consistent company percentage (e.g., always 30%)
- Jobs vary widely in price (£50 to £500)
- You're okay with company revenue scaling with job value
- Simple revenue sharing model

❌ **Don't use when:**
- Cheap jobs give company too little revenue
- You need guaranteed minimum company revenue

---

### **When to use FIXED MARGIN:**

✅ **Use when:**
- You need predictable company revenue per job
- Administrative costs are fixed per job
- You want drivers to benefit more from expensive jobs
- Simple flat-fee model

❌ **Don't use when:**
- Jobs vary widely in price (£15 on £50 job = 30%, but on £300 job = 5%)
- Company needs revenue to scale with job complexity

---

### **When to use HYBRID MARGIN:**

✅ **Use when:**
- You want best of both worlds
- Need minimum company revenue guarantee
- Want percentage scaling for expensive jobs
- Most flexible option

❌ **Don't use when:**
- Simplicity is more important than optimization
- Team finds varying percentages confusing

---

## 💡 RECOMMENDED CONFIGURATION

### **🎯 DEFAULT SETUP (RECOMMENDED):**

```typescript
{
  useDriverRateCards: true,  // Use separate driver rate cards
  type: 'hybrid',             // If rate cards disabled, use hybrid
  percentageMargin: 20,       // 20% margin on jobs
  minimumMargin: 10,          // Minimum £10 per job
}
```

**Why this works:**
- ✅ Driver rate cards give full pricing control
- ✅ Hybrid margin as fallback ensures fairness
- ✅ 20% is industry standard
- ✅ £10 minimum protects company on small jobs

---

## 🔗 INTEGRATION WITH DRIVER PRICING SYSTEM

### **⚠️ IMPORTANT: This is DIFFERENT from Driver Pricing Engine!**

| Feature | Margin Configuration | Driver Pricing Engine |
|---------|---------------------|----------------------|
| **Purpose** | Calculate driver earnings from customer price | Price extra items added on-site |
| **Scope** | Main job pricing | Extra items only |
| **Split** | Company vs Driver | Driver commission vs Company |
| **When** | Quote generation | On-site additions |
| **Default** | 70/30 split | 70/30 split |

### **Example Integration:**

```
MAIN JOB:
Customer pays: £150
Margin Config (30%): Company £45, Driver £105

EXTRA ITEMS (ON-SITE):
Customer pays: £100 (Washing Machine)
Driver Pricing (70/30): Driver £70, Company £30

TOTAL:
Customer pays: £250
Driver gets: £105 + £70 = £175 (70%)
Company gets: £45 + £30 = £75 (30%)
```

---

## 📈 ANALYTICS & TRACKING

### **Metrics to Monitor:**

1. **Company Margin:**
   - Average margin per job
   - Total margin revenue
   - Margin % by job type

2. **Driver Earnings:**
   - Average driver earnings per job
   - Driver satisfaction (are they earning enough?)
   - Retention rate

3. **Split Analysis:**
   - Percentage vs Fixed vs Hybrid performance
   - Which margin type generates most revenue?
   - Which margin type drivers prefer?

### **Example Dashboard:**

```
┌────────────────────────────────────────────────────┐
│ Margin Performance - January 2026                  │
├────────────────────────────────────────────────────┤
│ Total Jobs: 547                                    │
│ Total Customer Revenue: £82,050                    │
│ Total Company Margin: £24,615 (30%)                │
│ Total Driver Earnings: £57,435 (70%)               │
│                                                    │
│ Average Per Job:                                   │
│ - Customer Price: £150.00                          │
│ - Company Margin: £45.00                           │
│ - Driver Earnings: £105.00                         │
│                                                    │
│ Margin Type Distribution:                          │
│ - Percentage: 342 jobs (62%)                       │
│ - Fixed: 103 jobs (19%)                            │
│ - Hybrid: 102 jobs (19%)                           │
└────────────────────────────────────────────────────┘
```

---

## 🚀 ADVANCED FEATURES (FUTURE)

### **1. Dynamic Margins:**
```typescript
// Example: Peak hours = higher company margin
if (isWeekend || isPeakHours) {
  percentageMargin = 35%; // Company gets more
} else {
  percentageMargin = 25%; // Driver gets more
}
```

### **2. Driver Tier-Based Margins:**
```typescript
// Example: Experienced drivers get better rates
if (driverTier === 'platinum') {
  percentageMargin = 15%; // Driver gets 85%
} else if (driverTier === 'gold') {
  percentageMargin = 20%; // Driver gets 80%
} else {
  percentageMargin = 30%; // Driver gets 70%
}
```

### **3. Job Type-Based Margins:**
```typescript
// Example: Different margins for different services
switch (serviceType) {
  case 'house-move':
    percentageMargin = 30%; // Complex jobs
    break;
  case 'furniture-items':
    percentageMargin = 20%; // Simple jobs
    break;
  case 'clearance':
    percentageMargin = 25%; // Medium complexity
    break;
}
```

---

## ✅ BEST PRACTICES

### **✅ DO:**
- Use driver rate cards for full control
- Set realistic margins (20-30% is standard)
- Use hybrid margin for flexibility
- Monitor driver satisfaction
- Adjust margins based on market conditions
- Communicate margins transparently to drivers

### **❌ DON'T:**
- Set margins too high (drivers leave)
- Set margins too low (company loses money)
- Change margins frequently (confuses drivers)
- Hide margin calculation from drivers
- Use fixed margin on widely varying job prices

---

## 🎓 QUICK REFERENCE

### **Formulas:**

```typescript
// PERCENTAGE
driverPrice = customerPrice × (1 - percentageMargin)

// FIXED
driverPrice = customerPrice - fixedMargin

// HYBRID
margin = MAX(
  customerPrice × percentageMargin,
  minimumMargin
)
driverPrice = customerPrice - margin
```

### **Example Calculations:**

| Customer Price | Margin Type | Config | Driver Price | Company Margin |
|----------------|-------------|--------|--------------|----------------|
| £150 | Percentage | 30% | £105 | £45 (30%) |
| £150 | Fixed | £15 | £135 | £15 (10%) |
| £150 | Hybrid | 20% or £10 | £120 | £30 (20%) |
| £50 | Percentage | 30% | £35 | £15 (30%) |
| £50 | Fixed | £15 | £35 | £15 (30%) |
| £50 | Hybrid | 20% or £10 | £40 | £10 (20%) |

---

## 🎯 SUMMARY

**Margin Configuration** is a powerful tool for automatically calculating driver earnings from customer prices. It offers three modes:

1. **🎯 Driver Rate Cards (RECOMMENDED)** - Separate pricing for drivers
2. **📊 Percentage Margin** - Company takes X% of customer price
3. **💵 Fixed Margin** - Company takes fixed £X per job
4. **⚖️ Hybrid Margin** - Percentage OR minimum, whichever is higher

**Default Setup:**
- ✅ Use Driver Rate Cards: **Enabled**
- ✅ Fallback Margin Type: **Hybrid**
- ✅ Percentage: **20%**
- ✅ Minimum: **£10**

**Final Result:**
- Customer pays based on customer rate cards
- Driver earns based on driver rate cards (or margin calculation)
- Company keeps the difference automatically

---

**Documentation Complete!**  
**Status:** ✅ PRODUCTION READY  
**Last Updated:** January 19, 2026
