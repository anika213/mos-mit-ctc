import { getRandom } from "../../../utils/utils";

// Generates a cycle from a start value, target amplitude, and fluctuation given as a decimal
function generateCycle(startValue, targetAmplitude, fluctuation) {
  const data = [];
  const points = 25;

  // Five phases for every cycle: rise (10%), first drop (40%), plateau (20%), second drop (10%), and a lower plateau (20%)
  const upPoints = points / 10; // 1/10
  const downPoints = 2 * points / 5; // 5/10
  const stillPoints = points / 5; // 7/10
  const down2Points = points / 10; // 8/10
  const stillDownPoints = points - upPoints - downPoints - stillPoints - down2Points; // 10/10

  // Target peak value for the cycle and upward amplitude
  const amplitude = Math.floor(targetAmplitude * getRandom(1 - fluctuation, 1 + fluctuation));
  const endValue = amplitude;

  // Generate up phase
  for (let i = 0; i < upPoints; i++) {
    data.push(startValue + (i / upPoints) * amplitude);
  }

  // Generate down phase
  for (let i = 0; i < downPoints; i++) {
    data.push(endValue - (i / downPoints) * amplitude);
  }

  // Generate plateau phase
  for (let i = 0; i < stillPoints; i++) {
    data.push(getRandom(-50, 50));
  }

  const finalValue = 0 - amplitude;

  // Generate second drop phase
  for (let i = 0; i < down2Points; i++) {
    data.push(0 - (i / down2Points) * amplitude);
  }

  // Generate second plateau phase
  for (let i = 0; i < stillDownPoints; i++) {
    data.push(finalValue + getRandom(-50, 50));
  }

  // Return cycle
  return {
    data: data,
    endValue: finalValue
  };
}

// linear interpolation
function interpolateData(data, totalPoints) {
  const factor = totalPoints / data.length;
  const interpolated = [];
  for (let i = 0; i < data.length - 1; i++) {
      const start = data[i];
      const end = data[i + 1];
      interpolated.push(start);

      for (let j = 1; j < factor; j++) {
          const interpolatedPoint = start + (end - start) * (j / factor);
          interpolated.push(interpolatedPoint);
      }
  }
  interpolated.push(data[data.length - 1]);
  return interpolated;
}

// Gaussian smoothing
function smoothData(data, sigma) {
  const kernelSize = Math.ceil(sigma * 3) * 2 + 1;
  const kernel = [];
  const smoothed = [];
  const halfKernel = Math.floor(kernelSize / 2);
  let kernelSum = 0;

  for (let i = -halfKernel; i <= halfKernel; i++) {
      const value = Math.exp(-(i ** 2) / (2 * sigma ** 2));
      kernel.push(value);
      kernelSum += value;
  }
  // Normalize the kernel
  for (let i = 0; i < kernel.length; i++) {
      kernel[i] /= kernelSum;
  }

  // Apply the kernel
  for (let i = 0; i < data.length; i++) {
      let sum = 0;
      for (let j = -halfKernel; j <= halfKernel; j++) {
          const index = i + j;
          if (index >= 0 && index < data.length) {
              sum += data[index] * kernel[j + halfKernel];
          }
      }
      smoothed.push(sum);
  }

  return smoothed;
}

// Processes the breathing data by interpolating it, smoothing it, and returning an array including time
function processBreathingData(data) {
  const interpolatedData = interpolateData(data, 5000);
  const smoothedData = smoothData(interpolatedData, 5000 / 250);

  const time = [...new Array(smoothedData.length)].map((_, i) => i); // x axis is time from 0 to the length of the smoothed data
  return [time, smoothedData];
}

// Generates regular light breathing cycles: shallower and faster than deep sleep
export function generateLightSleep() {
  const cycles = 14;
  const data = [];
  let nextStartValue = -1100;

  for (let cycle = 0; cycle < cycles; cycle++) {
    const newCycle = generateCycle(nextStartValue, 1000, 0.15); // Target end value of 1100, minor fluctuations
    nextStartValue = newCycle.endValue;
    data.push(...newCycle.data);
  }

  return processBreathingData(data);
}

// Generates regular deep breathing cycles
export function generateDeepSleep() {
  const cycles = 12;
  const data = [];
  let nextStartValue = -1600;

  for (let cycle = 0; cycle < cycles; cycle++) {
    const newCycle = generateCycle(nextStartValue, 1800, 0.10); // Targent end value of 1800, very small fluctuations
    nextStartValue = newCycle.endValue;
    data.push(...newCycle.data);
  }

  return processBreathingData(data);
}

// Generates regular REM breathing cycles: irregular with bursts
export function generateREM() {
  const cycles = 16;
  const data = [];
  let nextStartValue = -1000;
  
  for (let cycle = 0; cycle < cycles; cycle++) {
    const newCycle = generateCycle(nextStartValue, 800, 0.35); // Target value of 1000, major fluctuations
    nextStartValue = newCycle.endValue;
    data.push(...newCycle.data);
  }

  return processBreathingData(data);
}

// Obstructive Sleep Apnea: flatline with recovery breaths
export function generateObstructiveSleepApnea() {
  const cycles = 14;
  const data = [];
  let nextStartValue = -1200;
  let cycleCount = 0;

  for (let cycle = 0; cycle < cycles; cycle++) {
    if (cycleCount > 6) {
      // Simulate an obstructive apnea episode: flatline followed by recovery breaths
      const recoveryBreath = generateCycle(0, 1800, 0.10); // Sharp recovery spikes (gasp)
      nextStartValue = recoveryBreath.endValue;
      data.push(...recoveryBreath.data);
      cycleCount = 0;
    } else if (cycleCount > 3) {
      // Simulate an obstructive apnea episode: flatline followed by recovery breaths
      const apnea = generateCycle(0, 0, 0); // No airflow
      nextStartValue = apnea.endValue;
      data.push(...apnea.data);
      cycleCount++;
    } else {
      // Normal breathing cycle
      const newCycle = generateCycle(nextStartValue, 1200, 0.10);
      nextStartValue = newCycle.endValue;
      data.push(...newCycle.data);
      cycleCount++;
    }
  }

  return processBreathingData(data);
}

// Central Sleep Apnea: flatline with gradual recovery instead of recovery gasps
export function generateCentralSleepApnea() {
  const cycles = 14;
  const data = [];
  let nextStartValue = -1200;
  let cycleCount = 0;

  // Would prob be better to use a switch but it's fine
  for (let cycle = 0; cycle < cycles; cycle++) {
    if (cycleCount > 4) {
      // Simulate an central apnea episode: flatline without recovery breaths
      const gradualRecoveryBreath = generateCycle(0, cycleCount * 100, 0.05); // Gradual recovery breaths
      nextStartValue = gradualRecoveryBreath.endValue;
      data.push(...gradualRecoveryBreath.data);
      cycleCount++;

      if (cycleCount > 8) {
        cycleCount = 0;
      }
    } else if (cycleCount > 2) {
      // Simulate an central apnea episode: flatline without recovery breaths
      const apnea = generateCycle(0, 0, 0); // No airflow
      nextStartValue = apnea.endValue;
      data.push(...apnea.data);
      cycleCount++;
    } else {
      // Normal breathing cycle
      const newCycle = generateCycle(nextStartValue, 1200, 0.15);
      nextStartValue = newCycle.endValue;
      data.push(...newCycle.data);
      cycleCount++;
    }
  }

  return processBreathingData(data);
}

// Hypopnea: Shallow breathing episodes (basically apnea without complete obstruction)
export function generateHypopnea() {
  const cycles = 14;
  const data = [];
  let nextStartValue = getRandom(-1200, -1000);
  let cycleCount = 0;

  for (let cycle = 0; cycle < cycles; cycle++) {
    if (cycleCount > 2) {
      // Simulate a shallow breathing episode
      const shallowCycle = generateCycle(nextStartValue, 500, 0.10);
      nextStartValue = shallowCycle.endValue;
      data.push(...shallowCycle.data);
      cycleCount++;

      if (cycleCount > 6) {
        cycleCount = 0;
      }
    } else {
      // Normal breathing cycle
      const newCycle = generateCycle(nextStartValue, 1400, 0.10);
      nextStartValue = newCycle.endValue;
      data.push(...newCycle.data);
      cycleCount++;
    }
  }

  return processBreathingData(data);
}

// Cheyne-Stokes Respiration: Crescendo-decrescendo with apnea
export function generateCheyneStokes() {
  const data = [];
  let nextStartValue = getRandom(-1200);

  // Crescendo-decrescendo breathing
  for (let c = -3; c < 4; c++) {
    const newCycle = generateCycle(nextStartValue, 1400 - Math.pow(c, 2) * 100, 0.15);
    nextStartValue = newCycle.endValue;
    data.push(...newCycle.data);
  }

  // Apnea breathing cycle
  for (let c = 0; c < 3; c++) {
    const newCycle = generateCycle(nextStartValue, 0, 0);
    nextStartValue = newCycle.endValue;
    data.push(...newCycle.data);
  }

  // Crescendo-decrescendo breathing
  for (let c = -3; c < 4; c++) {
    const newCycle = generateCycle(nextStartValue, 1400 - Math.pow(c, 2) * 100, 0.15);
    nextStartValue = newCycle.endValue;
    data.push(...newCycle.data);
  }

  return processBreathingData(data);
}

// Biot’s Respiration: clusters (rapid & shallow breaths) with apnea
export function generateBiotsRespiration() {
  const data = [];
  let nextStartValue = -500;

  // Clusters
  for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) {
      // Shallow breathing clusters
      for (let c = 0; c < 4; c++) {
        const shallowCycle = generateCycle(nextStartValue, 500, 0.15);
        nextStartValue = shallowCycle.endValue;
        data.push(...shallowCycle.data);
      }
    } else {
      // Apnea
      for (let c = 0; c < 4; c++) {
        const apnea = generateCycle(0, 0, 0);
        nextStartValue = apnea.endValue;
        data.push(...apnea.data);
      }
    }
  }

  return processBreathingData(data);
}