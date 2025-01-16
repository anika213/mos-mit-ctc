import { getRandom } from "../../../utils/utils";

// Generates a cycle from a start value, target end value, fluctuation given as a decimal, and points
function generateCycle(startValue, targetAmplitude, fluctuation, points) {
  // Holds data points for the plot
  const data = [];

  // Five phases for every cycle: rise (10%), major drop (40%), plateau (20%), minor drop (10%), and a lower plateau (20%)
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
function processBreathingData(data, points) {
  const interpolatedData = interpolateData(data, points);
  const smoothedData = smoothData(interpolatedData, points / 500);

  const time = [...new Array(smoothedData.length)].map((_, i) => i); // x axis is time from 0 to the length of the smoothed data
  return [time, smoothedData];
}

// Generates regular light breathing cycles: shallower and faster than deep sleep
export function generateLightSleep() {
  const points = 5000;
  const cycles = 14;
  const data = [];
  let nextStartValue = -1200;

  for (let cycle = 0; cycle < cycles; cycle++) {
    const newCycle = generateCycle(nextStartValue, 1200, 0.10, 15); // Target end value of 1000, minor fluctuations
    nextStartValue = newCycle.endValue;
    data.push(...newCycle.data);
  }

  return processBreathingData(data, points);
}

// Generates regular deep breathing cycles
export function generateDeepSleep() {
  const points = 5000;
  const cycles = 10;
  const data = [];
  let nextStartValue = -1600;

  for (let cycle = 0; cycle < cycles; cycle++) {
    const newCycle = generateCycle(nextStartValue, 1600, 0.05, 25); // Targent end value of 1600, very small fluctuations
    nextStartValue = newCycle.endValue;
    data.push(...newCycle.data);
  }

  return processBreathingData(data, points);
}

// Generates regular REM breathing cycles: irregular with bursts
export function generateREM() {
  const points = 5000;
  const cycles = 16;
  const data = [];
  let nextStartValue = -1000;
  
  for (let cycle = 0; cycle < cycles; cycle++) {
    const newCycle = generateCycle(nextStartValue, 1000, 0.20, 20); // Target value of 1000, major fluctuations
    nextStartValue = newCycle.endValue;
    data.push(...newCycle.data);
  }

  return processBreathingData(data, points);
}

// Irregular sleep uses light sleep as its framework for cycles and amplitudes

// Obstructive Sleep Apnea: flatline with recovery breaths
export function generateObstructiveSleepApnea() {
  const points = 5000;
  const cycles = 14;
  const data = [];
  let nextStartValue = -1200;
  let cycleCount = 0;

  for (let cycle = 0; cycle < cycles; cycle++) {
    if (cycleCount > 6) {
      // Simulate an obstructive apnea episode: flatline followed by recovery breaths
      const recoveryBreath = generateCycle(0, 1800, 0.10, 20); // Sharp recovery spikes (gasp)
      nextStartValue = recoveryBreath.endValue;
      data.push(...recoveryBreath.data);
      cycleCount = 0;
    } else if (cycleCount > 3) {
      // Simulate an obstructive apnea episode: flatline followed by recovery breaths
      const apnea = generateCycle(0, 0, 0, 10); // No airflow
      nextStartValue = apnea.endValue;
      data.push(...apnea.data);
      cycleCount++;
    } else {
      // Normal breathing cycle
      const newCycle = generateCycle(nextStartValue, 1200, 0.10, 20);
      nextStartValue = newCycle.endValue;
      data.push(...newCycle.data);
      cycleCount++;
    }
  }

  return processBreathingData(data, points);
}

// Central Sleep Apnea: flatline without recovery gasps
export function generateCentralSleepApnea() {
  const points = 5000;
  const cycles = 14;
  const data = [];
  let nextStartValue = -1200;
  let cycleCount = 0;

  // Would prob be better to use a switch but it's fine
  for (let cycle = 0; cycle < cycles; cycle++) {
    if (cycleCount > 5) {
      // Simulate an central apnea episode: flatline without recovery breaths
      const gradualRecoveryBreath = generateCycle(0, cycleCount * 100, 0.10, 20); // Gradual recovery breaths
      nextStartValue = gradualRecoveryBreath.endValue;
      data.push(...gradualRecoveryBreath.data);
      cycleCount++;

      if (cycleCount > 8) {
        cycleCount = 0;
      }
    } else if (cycleCount > 2) {
      // Simulate an central apnea episode: flatline without recovery breaths
      const apnea = generateCycle(0, 0, 0, 10); // No airflow
      nextStartValue = apnea.endValue;
      data.push(...apnea.data);
      cycleCount++;
    } else {
      // Normal breathing cycle
      const newCycle = generateCycle(nextStartValue, 1200, 0.10, 20);
      nextStartValue = newCycle.endValue;
      data.push(...newCycle.data);
      cycleCount++;
    }
  }

  return processBreathingData(data, points);
}

// Hypopnea: Shallow breathing episodes with gaps
// For now, 4 reg breaths, 3 shallow breaths, etc.
export function generateHypopnea() {
  const points = 5000;
  const cycles = 14;
  const data = [];

  let nextStartValue = getRandom(-1200, -1000);
  let normalCycleCount = 0;

  for (let cycle = 0; cycle < cycles; cycle++) {
    if (normalCycleCount > 7) {
      normalCycleCount = 0;
    } else if (normalCycleCount > 4) {
      // Shallow breathing
      const shallowCycle = generateCycle(nextStartValue, 1000, 20);
      nextStartValue = shallowCycle.endValue;
      // Add a gap before normal breathing
      const gap = new Array(8).fill(0);
      data.push(...gap, ...shallowCycle.data);
    } else {
      // Regular breathing cycle
      const regularCycle = generateCycle(nextStartValue, 1500, 20);
      nextStartValue = regularCycle.endValue;
      data.push(...regularCycle.data);
      normalCycleCount++;
    }
  }

  return processBreathingData(data, points);
}

// Cheyne-Stokes Respiration: Crescendo-decrescendo with apnea
// NOT IMPLEMENTED
export function generateCheyneStokes() {
  const points = 5000;
  const cycles = 14;
  const data = [];

  let nextStartValue = getRandom(-1800, -1600);
  for (let cycle = 0; cycle < cycles; cycle++) {
    const newCycle = generateCycle(nextStartValue, 2000, 25);
    nextStartValue = newCycle.endValue;
    data.push(...newCycle.data);
  }

  return processBreathingData(data, points);
}

// Biot’s Respiration: clusters (rapid & shallow breaths) with apnea
export function generateBiotsRespiration() {
  const points = 5000;
  const cycles = 16;
  const data = [];
  let nextStartValue = getRandom(-1500, -1300);

  // Cluster of breaths followed by apnea
  for (let cycle = 0; cycle < cycles; cycle++) {
    const cluster = generateCycle(nextStartValue, 1500, 15).data.map((value) =>
      value + getRandom(-200, 200)
    );
    const apnea = new Array(10).fill(0);

    data.push(...cluster, ...apnea);
  }

  const interpolatedData = interpolateData(data, points);
  const smoothedData = smoothData(interpolatedData, points / 500);

  const time = [...new Array(smoothedData.length)].map((_, i) => i);
  return [time, smoothedData];
}


// OLD STUFF FOLLOWS OLD STUFF FOLLOWS OLD STUFF FOLLOWS


// Generates regular breathing by generating many cycles, interpolating the data, and then smoothing it
// export function generateRegularBreathing(points, cycles) {
//   const data = [];

//   let nextStartValue = getRandom(-1500, -1300);
//   for (let cycle = 0; cycle < cycles; cycle++) {
//     const newCycle = generateCycle(nextStartValue, 20); // 20 points per cycle
//     nextStartValue = newCycle.endValue;
//     data.push(...newCycle.data);
//   }

//   return processBreathingData(data, points);
// }

// export function generateSleepApnea(points, cycles) {
//   const data = [];
//   const notBreathingCycles = 1 + Math.floor(getRandom(cycles / 5, cycles / 3));
//   const notBreathingI = Math.floor(getRandom(1, cycles - notBreathingCycles));

//   let nextStartValue = getRandom(-1500, -1300);
//   for (let cycle = 0; cycle < cycles; cycle++) {
//     // If the current cycle lacks breathing then the data will be zero
//     if (cycle >= notBreathingI && cycle < notBreathingI + notBreathingCycles) {
//       const notBreathingData = [...new Array(20)].map(() => 0);
//       data.push(...notBreathingData);
//     } else {
//       const newCycle = generateCycle(nextStartValue, 20);
//       nextStartValue = newCycle.endValue;
//       data.push(...newCycle.data);
//     }
//   }

//   return processBreathingData(data, points);
// }
