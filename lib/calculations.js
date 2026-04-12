const GRAVITY = 9.80665;

export function calculateRockLoadSimplified(rmr, roofThickness) {
  return 0.1 * (100 - rmr) * roofThickness;
}

export function calculateRockLoadCMRI(rmr, gamma, span) {
  return gamma * span * (1.7 - 0.037 * rmr + 0.0002 * rmr * rmr);
}

export function calculateEffectiveCapacityKN(boltCapacity, boltEfficiency, plateEfficiency) {
  return boltCapacity * boltEfficiency * plateEfficiency;
}

export function convertKNtoTonnes(kn) {
  return kn / GRAVITY;
}

// Rock load is in t/m^2, so capacity must be in tonnes for unit-consistent spacing.
export function calculateSpacing(effectiveCapacityT, rockLoad, fos, jf) {
  const denominator = rockLoad * fos * jf;
  if (denominator <= 0) return 0;
  return Math.sqrt(effectiveCapacityT / denominator);
}

export function calculateSupportDensity(effectiveCapacityT, spacing) {
  if (spacing <= 0) return 0;
  return effectiveCapacityT / (spacing * spacing);
}

export function calculateAchievedFoS(effectiveCapacityT, rockLoad, jf, spacing) {
  const denominator = rockLoad * jf * spacing * spacing;
  if (denominator <= 0) return 0;
  return effectiveCapacityT / denominator;
}

export function buildReferenceRows(gamma, span, effectiveCapacityT, fos) {
  const rmrValues = [30, 40, 50, 60, 70, 80];
  return rmrValues.map((rmrValue) => {
    const rockLoad = calculateRockLoadCMRI(rmrValue, gamma, span);
    const spacing = calculateSpacing(effectiveCapacityT, rockLoad, fos, 1);
    return { rmr: rmrValue, rockLoad, spacing };
  });
}

/**
 * Truncate to a fixed number of decimal places (toward zero), e.g. 4.678 → 4.6, 1.2423 → 1.2.
 * Default is one decimal place for result display.
 */
export function roundValue(value, decimals = 1) {
  if (Number.isNaN(value) || !Number.isFinite(value)) return "-";
  const d = Math.max(0, Math.min(15, Math.floor(decimals)));
  const factor = 10 ** d;
  return Math.trunc(value * factor) / factor;
}
