# ShiftMyHome - Multi-Service Quote Flow Architecture

## 🎯 Core Principle
**Each service = completely isolated flow (Step 1-6)**

No shared logic between services. Only shared UI components (buttons, inputs, etc).

---

## 📁 Folder Structure

```
/components/quote/
  /flows/
    /house-move/
      - HouseMoveStep1Address.tsx
      - HouseMoveStep2Inventory.tsx
      - HouseMoveStep3Access.tsx
      - HouseMoveStep4Details.tsx
      - HouseMoveStep5Review.tsx
      - HouseMoveStep6Confirmation.tsx
      - houseMoveTypes.ts (data model)
      
    /clearance-removal/
      - ClearanceStep1Address.tsx
      - ClearanceStep2Inventory.tsx (with waste categories)
      - ClearanceStep3Access.tsx
      - ClearanceStep4Details.tsx
      - ClearanceStep5Review.tsx
      - ClearanceStep6Confirmation.tsx
      - clearanceTypes.ts (data model)
      
    /furniture-items/
      - FurnitureStep1Address.tsx
      - FurnitureStep2Inventory.tsx
      - FurnitureStep3Access.tsx
      - FurnitureStep4Details.tsx
      - FurnitureStep5Review.tsx
      - FurnitureStep6Confirmation.tsx
      - furnitureTypes.ts (data model)
      
    /motorbike-bicycle/
      - MotorbikeStep1Address.tsx
      - MotorbikeStep2Details.tsx (vehicle details)
      - MotorbikeStep3Access.tsx
      - MotorbikeStep4Extras.tsx
      - MotorbikeStep5Review.tsx
      - MotorbikeStep6Confirmation.tsx
      - motorbikeTypes.ts (data model)
      
    /store-pickup/
      - StoreStep1Address.tsx
      - StoreStep2Items.tsx
      - StoreStep3Access.tsx
      - StoreStep4Details.tsx
      - StoreStep5Review.tsx
      - StoreStep6Confirmation.tsx
      - storeTypes.ts (data model)
      
    /other-delivery/
      - OtherStep1Address.tsx
      - OtherStep2Details.tsx
      - OtherStep3Access.tsx
      - OtherStep4Extras.tsx
      - OtherStep5Review.tsx
      - OtherStep6Confirmation.tsx
      - otherTypes.ts (data model)
  
  /shared/
    - QuoteHeader.tsx (reusable)
    - QuoteProgressBar.tsx (reusable)
    - QuoteSummaryPanel.tsx (reusable)
    - MapPreview.tsx (reusable)
    - PropertyTypeSelector.tsx (reusable)
    - UKAddressAutocomplete.tsx (reusable)
```

---

## 🛣️ Route Structure

Each service has its own route pattern:

```
/quote/house-move/step/1
/quote/house-move/step/2
/quote/house-move/step/3
/quote/house-move/step/4
/quote/house-move/step/5
/quote/house-move/step/6

/quote/clearance-removal/step/1
/quote/clearance-removal/step/2
/quote/clearance-removal/step/3
/quote/clearance-removal/step/4
/quote/clearance-removal/step/5
/quote/clearance-removal/step/6

/quote/furniture-items/step/1
...

/quote/motorbike-bicycle/step/1
...

/quote/store-pickup/step/1
...

/quote/other-delivery/step/1
...
```

---

## 🔄 QuoteWizard Refactor

**OLD (WRONG):**
```tsx
// One wizard with if/else for all services
<QuoteWizard serviceType={serviceType}>
  {step === 1 && <Step1Address />}
  {step === 2 && <Step2Inventory />}
  ...
</QuoteWizard>
```

**NEW (CORRECT):**
```tsx
// Service-specific wizard orchestrator
<QuoteFlowOrchestrator serviceType={serviceType} />

// Inside orchestrator:
switch (serviceType) {
  case 'house-move':
    return <HouseMoveFlow />;
  case 'clearance':
    return <ClearanceFlow />;
  case 'furniture':
    return <FurnitureFlow />;
  case 'motorbike':
    return <MotorbikeFlow />;
  case 'store-pickup':
    return <StorePickupFlow />;
  case 'other':
    return <OtherDeliveryFlow />;
}
```

Each `*Flow` component manages its own:
- State (localStorage key specific to service)
- Step navigation
- Data validation
- Pricing calculation

---

## 📊 Data Models (Separate per Service)

### House Move
```ts
interface HouseMoveQuote {
  serviceType: 'house-move';
  pickup: HouseMoveAddress;
  dropoff: HouseMoveAddress;
  inventory: RoomBasedInventory;
  access: AccessDetails;
  date: Date;
  // ... house-specific fields
}
```

### Clearance & Removal
```ts
interface ClearanceQuote {
  serviceType: 'clearance';
  pickup: ClearanceAddress;
  wasteData: {
    household: WasteItem[];
    garden: WasteItem[];
    builders: WasteItem[];
  };
  disposalType: 'recycling' | 'landfill' | 'donate';
  totalVolume: number;
  estimatedTime: number;
  // ... clearance-specific fields
}
```

### Motorbike / Bicycle
```ts
interface MotorbikeQuote {
  serviceType: 'motorbike';
  pickup: Address;
  dropoff: Address;
  vehicle: {
    type: 'motorbike' | 'bicycle' | 'scooter';
    make: string;
    model: string;
    condition: 'running' | 'non-running';
  };
  // ... motorbike-specific fields
}
```

---

## 🔐 LocalStorage Strategy

Each service has its own storage key:

```ts
// OLD (WRONG):
localStorage.setItem('quoteData', JSON.stringify(data));

// NEW (CORRECT):
localStorage.setItem('quote-house-move', JSON.stringify(houseMoveData));
localStorage.setItem('quote-clearance', JSON.stringify(clearanceData));
localStorage.setItem('quote-motorbike', JSON.stringify(motorbikeData));
```

---

## 🎨 Shared UI Components

These CAN be shared (visual only, no logic):

✅ QuoteHeader (visual header)
✅ QuoteProgressBar (visual progress)
✅ QuoteSummaryPanel (visual summary - receives props)
✅ MapPreview (visual map)
✅ PropertyTypeSelector (reusable selector)
✅ UKAddressAutocomplete (reusable input)
✅ Buttons, inputs, modals (UI primitives)

These CANNOT be shared (logic + data):

❌ Step components (each service has its own)
❌ Pricing calculation (each service has unique logic)
❌ Inventory structure (each service is different)
❌ Validation rules (each service has different requirements)

---

## 🚀 Migration Plan

### Phase 1: Setup Infrastructure
1. Create `/components/quote/flows/` folder structure
2. Create service-specific type definitions
3. Create `QuoteFlowOrchestrator.tsx`

### Phase 2: Migrate House Move (baseline)
1. Copy current steps → `/flows/house-move/`
2. Rename: `Step1Address.tsx` → `HouseMoveStep1Address.tsx`
3. Remove all clearance-specific conditionals
4. Update localStorage key to `quote-house-move`
5. Create `HouseMoveFlow.tsx` wrapper

### Phase 3: Migrate Clearance & Removal
1. Create `/flows/clearance-removal/`
2. Build `ClearanceStep1Address.tsx` (no PropertyType)
3. Build `ClearanceStep2Inventory.tsx` (with ClearanceInventoryStep)
4. Build remaining steps
5. Update localStorage key to `quote-clearance`
6. Create `ClearanceFlow.tsx` wrapper

### Phase 4: Stub Remaining Services
1. Create basic flows for:
   - Furniture & Items
   - Motorbike / Bicycle
   - Store Pickup
   - Other Delivery
2. Each has placeholder steps
3. Each can complete quote flow

### Phase 5: Cleanup
1. Delete old `/components/quote/steps/` folder
2. Delete old `QuoteWizard.tsx`
3. Update all imports
4. Test all 6 services end-to-end

---

## 🎯 Success Criteria

✅ Each service has 6 completely independent steps
✅ Changing Clearance Step 2 does NOT affect House Move
✅ Each service has its own data model
✅ Each service has its own localStorage key
✅ No `if (serviceType === ...)` conditionals in step components
✅ All 6 service cards on homepage work independently
✅ Pricing calculation works correctly for each service

---

## 📝 Developer Rules

1. **NEVER** add conditional logic based on `serviceType` inside a step component
2. **ALWAYS** create a new step file for service-specific behavior
3. **ONLY** share visual UI components, NEVER share data/logic components
4. **EACH** service flow must be testable in complete isolation
5. **NO** cross-service dependencies or imports

---

## 🔧 Technical Implementation Notes

### QuoteFlowOrchestrator.tsx
```tsx
export function QuoteFlowOrchestrator({ serviceType }: { serviceType: string }) {
  // Route to correct flow based on service type
  switch (serviceType) {
    case 'house-move':
      return <HouseMoveFlow />;
    case 'clearance':
      return <ClearanceFlow />;
    case 'furniture':
      return <FurnitureFlow />;
    case 'motorbike':
      return <MotorbikeFlow />;
    case 'store-pickup':
      return <StorePickupFlow />;
    case 'other':
      return <OtherDeliveryFlow />;
    default:
      return <div>Invalid service type</div>;
  }
}
```

### Service Flow Example (HouseMoveFlow.tsx)
```tsx
export function HouseMoveFlow() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<HouseMoveQuote>(() => 
    loadFromStorage('quote-house-move') || getDefaultHouseMoveData()
  );

  useEffect(() => {
    saveToStorage('quote-house-move', data);
  }, [data]);

  return (
    <div>
      <QuoteHeader serviceType="house-move" />
      <QuoteProgressBar currentStep={step} totalSteps={6} />
      
      {step === 1 && <HouseMoveStep1Address data={data} onChange={setData} onNext={() => setStep(2)} />}
      {step === 2 && <HouseMoveStep2Inventory data={data} onChange={setData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <HouseMoveStep3Access data={data} onChange={setData} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <HouseMoveStep4Details data={data} onChange={setData} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
      {step === 5 && <HouseMoveStep5Review data={data} onChange={setData} onNext={() => setStep(6)} onBack={() => setStep(4)} />}
      {step === 6 && <HouseMoveStep6Confirmation data={data} />}
    </div>
  );
}
```

---

**This architecture ensures:**
- ✅ Clean separation of concerns
- ✅ Zero cross-contamination between services
- ✅ Easy to add new services
- ✅ Easy to modify existing services
- ✅ Correct pricing per service
- ✅ Maintainable long-term
