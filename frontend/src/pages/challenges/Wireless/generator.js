import { getRandom } from "../../../utils/utils";

function generateCycle(startValue, points) {
  const data = [];

  const upPoints = points / 10; // 1/10
  const downPoints = 2 * points / 5; // 5/10
  const stillPoints = points / 5; // 7/10
  const down2Points = points / 10; // 8/10
  const stillDownPoints = points - upPoints - downPoints - stillPoints - down2Points; // 10/10

  const endValue = getRandom(2000, 3000);
  const upAmp = endValue - startValue;

  for (let i = 0; i < upPoints; i++) {
    data.push(startValue + (i / upPoints) * upAmp);
  }

  const midValue = getRandom(-50, 50);
  const downAmp = endValue - midValue;
  for (let i = 0; i < downPoints; i++) {
    data.push(endValue - (i / downPoints) * downAmp);
  }

  for (let i = 0; i < stillPoints; i++) {
    data.push(midValue + getRandom(-50, 50));
  }

  const finalValue = getRandom(-1500, -1300);
  const down2Amp = midValue - finalValue;
  for (let i = 0; i < down2Points; i++) {
    data.push(midValue - (i / down2Points) * down2Amp);
  }

  for (let i = 0; i < stillDownPoints; i++) {
    data.push(finalValue + getRandom(-50, 50));
  }

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

export function generateRegularBreathing(points, cycles) {
  const data = [];

  let nextStartValue = getRandom(-1500, -1300);
  for (let cycle = 0; cycle < cycles; cycle++) {
    const newCycle = generateCycle(nextStartValue, 20);
    nextStartValue = newCycle.endValue;
    data.push(...newCycle.data);
  }

  const interpolatedData = interpolateData(data, points);
  const smoothedData = smoothData(interpolatedData, points / 500);

  const time = [...new Array(smoothedData.length)].map((_, i) => i);
  return [time, smoothedData]
}

export function generateSleepApnea(points, cycles) {
  const data = [];

  const notBreathingCycles = 1 + Math.floor(getRandom(cycles / 5, cycles / 3));
  console.log(notBreathingCycles);
  const notBreathingI = Math.floor(getRandom(1, cycles - notBreathingCycles));

  let nextStartValue = getRandom(-1500, -1300);
  for (let cycle = 0; cycle < cycles; cycle++) {
    if (cycle >= notBreathingI && cycle < notBreathingI + notBreathingCycles) {
      const notBreathingData = [...new Array(20)].map(() => 0);
      data.push(...notBreathingData);
    } else {
      const newCycle = generateCycle(nextStartValue, 20);
      nextStartValue = newCycle.endValue;
      data.push(...newCycle.data);
    }
  }

  const interpolatedData = interpolateData(data, points);
  const smoothedData = smoothData(interpolatedData, points / 500);
  const time = [...new Array(smoothedData.length)].map((_, i) => i);
  return [time, smoothedData]
}
