// ✅ PRICING ENGINE - SOURCE OF TRUTH TESTS
// Ensures pricing engine uses correct sources for all calculations

import { calculatePrice, PricingInput } from '../pricingEngine';
import { DEFAULT_PRICING_CONFIG } from '../pricingConfigService';

describe('🛡️ PRICING ENGINE - SINGLE SOURCE OF TRUTH', () => {
  
  // ============================================
  // TEST A: Distance Cost - Service Type Priority
  // ============================================
  test('TEST A: Distance cost MUST use serviceType.pricePerMile, NOT vehicle.pricePerMile', () => {
    const input: PricingInput = {
      serviceType: 'house-move', // pricePerMile = 1.5 (from service type)
      distanceMiles: 10,
      inventory: [],
      vehiclePricePerMile: 1.0, // ❌ This should be IGNORED
    };

    const result = calculatePrice(input);
    
    // ✅ EXPECTED: 10 mi × £1.5/mi = £15 (from SERVICE TYPE)
    // ❌ WRONG: 10 mi × £1.0/mi = £10 (from VEHICLE)
    expect(result.distancePrice).toBe(15);
    expect(result.auditData?.distanceRatePerMile).toBe(1.5); // From service type
  });

  // ============================================
  // TEST B: Distance Cost when pricePerMile = 0
  // ============================================
  test('TEST B: Distance cost = 0 when serviceType.pricePerMile = 0', () => {
    const input: PricingInput = {
      serviceType: 'motorbike', // pricePerMile = 0 (flat rate service)
      distanceMiles: 10,
      inventory: [],
    };

    const result = calculatePrice(input);
    
    // ✅ EXPECTED: 10 mi × £0/mi = £0
    expect(result.distancePrice).toBe(0);
  });

  // ============================================
  // TEST C: Handling Time - Speed Rule from Pricing Rules
  // ============================================
  test('TEST C: Handling time MUST use handlingSpeed from Pricing Rules (NOT hardcoded)', () => {
    const input: PricingInput = {
      serviceType: 'house-move',
      distanceMiles: 0,
      inventory: [
        { id: 'double-bed', quantity: 1 }, // 1.81 m³
        { id: 'wardrobe', quantity: 1 },   // 1.68 m³
      ],
      crewSize: 2,
    };

    const result = calculatePrice(input);
    
    // ✅ EXPECTED: 
    // Volume = 1.81 + 1.68 = 3.49 m³
    // Handling time = 3.49 ÷ (2 × 4.5) = 0.39h (from Pricing Rules)
    // Handling cost = 0.39h × £25/h × 2 crew = £19.44
    
    const expectedVolume = 3.49;
    const expectedHandlingTime = expectedVolume / (2 * DEFAULT_PRICING_CONFIG.inventoryHandlingRules.handlingSpeedM3PerHourPerPerson);
    const expectedHandlingCost = expectedHandlingTime * DEFAULT_PRICING_CONFIG.inventoryHandlingRules.handlingPricePerHour * 2;
    
    expect(result.estimatedVolume).toBe(Math.round(expectedVolume));
    expect(result.handlingTimeHours).toBeCloseTo(expectedHandlingTime, 1);
    expect(result.breakdown.inventoryDetailed?.handlingPrice).toBeCloseTo(Math.round(expectedHandlingCost), 0);
  });

  // ============================================
  // TEST D: Complete Source Verification
  // ============================================
  test('TEST D: All pricing components use correct sources', () => {
    const input: PricingInput = {
      serviceType: 'house-move',
      distanceMiles: 10,
      inventory: [
        { id: 'double-bed', quantity: 1 },
      ],
      crewSize: 2,
    };

    const result = calculatePrice(input);
    
    // ✅ Verify audit data has correct sources
    expect(result.auditData?.distanceRatePerMile).toBe(1.5); // From service type, NOT vehicle
    expect(result.distancePrice).toBe(15); // 10 × 1.5
    
    // ✅ Verify minimum charge is from service type
    expect(result.minimumCharge).toBe(150); // From house-move service type
    
    // ✅ Verify handling calculations use Pricing Rules
    const handlingSpeed = DEFAULT_PRICING_CONFIG.inventoryHandlingRules.handlingSpeedM3PerHourPerPerson;
    expect(handlingSpeed).toBe(4.5); // From Pricing Rules
  });

  // ============================================
  // TEST E: Console Error Detection (Manual)
  // ============================================
  test('TEST E: Console error logged when vehicle pricePerMile conflicts with service type', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const input: PricingInput = {
      serviceType: 'house-move', // pricePerMile = 1.5
      distanceMiles: 10,
      inventory: [],
      vehiclePricePerMile: 2.0, // Different from service type
    };

    calculatePrice(input);
    
    // ✅ EXPECTED: Console error logged
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Vehicle pricePerMile')
    );
    
    consoleSpy.mockRestore();
  });
});

// ============================================
// 📌 MANUAL TEST SCENARIOS
// ============================================
/*

MANUAL TEST SCENARIO 1: Quote Calculator UI
--------------------------------------------
1. Open Admin → Quote Calculator
2. Set:
   - Service Type: House Move
   - Distance: 10 miles
   - Inventory: 1× Double Bed
   - Crew: 2 people
3. Calculate quote
4. Check console logs:
   ✅ Should see: "🚗 DISTANCE PRICE: £15.00 = 10 mi × £1.5/mi [SOURCE: House Move]"
   ✅ Should see: "📦 INVENTORY PRICE: £... (handling: £X [0.XXh × £25/h × 2 crew])"
   ❌ Should NOT see any vehicle pricePerMile being used

MANUAL TEST SCENARIO 2: Pricing Result Detail View
---------------------------------------------------
1. Generate a quote via Quote Calculator
2. Open the Pricing Result Detail View
3. Scroll to "Cost Summary"
4. Check Distance Cost breakdown:
   ✅ Should show: "10.0 mi × £1.50/mi [SOURCE: Service Type]"
   ✅ Should NOT show any reference to vehicle rate card
5. Check Detailed Breakdown → Handling Time Calculation:
   ✅ Should show: "Handling speed: 4.5 m³/h per person"
   ✅ Should show: "Formula: X.XX ÷ (2 × 4.5)"
   ✅ Should show: "Handling cost formula: X.XXh × £25/h × 2 crew"

*/
