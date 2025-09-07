const { exec } = require('child_process');
const fs = require('fs');

async function validateOptimization() {
  console.log('🧪 Running validation tests...');
  
  // Run original tests
  console.log('📊 Running original account-management tests...');
  const originalResult = await runTests('features/account-management.feature');
  
  // Run optimized tests  
  console.log('📊 Running optimized account-management tests...');
  const optimizedResult = await runTests('features/optimized/functional/account-management-optimized.feature');
  
  // Compare results
  const comparison = {
    original: {
      scenarios: originalResult.scenarios,
      steps: originalResult.steps,
      duration: originalResult.duration,
      success_rate: originalResult.success_rate
    },
    optimized: {
      scenarios: optimizedResult.scenarios,
      steps: optimizedResult.steps, 
      duration: optimizedResult.duration,
      success_rate: optimizedResult.success_rate
    }
  };
  
  console.log('📈 Validation Results:');
  console.table(comparison);
  
  // Validate optimization goals
  const reduction = ((comparison.original.duration - comparison.optimized.duration) / comparison.original.duration) * 100;
  console.log(`⚡ Performance improvement: ${reduction.toFixed(1)}%`);
  
  if (comparison.optimized.success_rate >= comparison.original.success_rate) {
    console.log('✅ Success rate maintained or improved');
  } else {
    console.log('❌ Success rate decreased - investigate!');
  }
}

function runTests(featurePath) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    exec(`npx cucumber-js ${featurePath}`, (error, stdout, stderr) => {
      const duration = Date.now() - startTime;
      const scenarios = (stdout.match(/scenarios? \(/g) || []).length;
      const steps = (stdout.match(/steps? \(/g) || []).length;
      const success_rate = error ? 0 : 100;
      
      resolve({ scenarios, steps, duration, success_rate });
    });
  });
}

validateOptimization().catch(console.error);