// Configuration file for the application
// This can be used to store app-wide settings and constants

const config = {
  // Application metadata
  appName: 'Support System Design Calculator',
  appVersion: '1.0.0',
  appDescription: 'A computational tool for designing roof-bolt support for underground coal mine galleries and junctions',
  
  // Calculator defaults
  defaults: {
    rmr: 50,
    roofThickness: 2.0,
    boltCapacity: 100,
    fos: 1.4,
    boltEfficiency: 0.85,
    plateEfficiency: 0.95,
    location: '1.0' // Gallery
  },
  
  // Validation ranges
  validation: {
    rmr: { min: 0, max: 100 },
    roofThickness: { min: 0.1, max: 10 },
    boltCapacity: { min: 10, max: 500 },
    fos: { min: 1.0, max: 3.0 },
    boltEfficiency: { min: 0, max: 1 },
    plateEfficiency: { min: 0, max: 1 },
    location: { min: 1.0, max: 2.0 }
  },
  
  // Calculation constants
  constants: {
    gravity: 9.80665, // m/s²
    rockLoadCoefficient: 0.1
  },
  
  // UI settings
  ui: {
    animationDuration: 300,
    themeStorageKey: 'theme',
    resultsDecimals: 3
  },
  
  // API endpoints (if you add backend later)
  api: {
    baseUrl: process.env.API_URL || '',
    endpoints: {
      calculate: '/api/calculate',
      validate: '/api/validate'
    }
  },
  
  // Feature flags
  features: {
    darkMode: true,
    analytics: false,
    exportResults: false
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
} else {
  window.config = config;
}

