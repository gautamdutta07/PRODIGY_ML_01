// Machine Learning Models Implementation
// Linear Regression and other ML algorithms implemented from scratch

export interface PropertyFeatures {
  area: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  location: string;
  age: number;
  amenities: string[];
  floor: number;
  furnishing: string;
}

export interface PredictionResult {
  price: number;
  confidence: number;
  priceRange: { min: number; max: number };
  breakdown: { [key: string]: number };
}

// City-specific price multipliers (per sq ft base price in INR)
const CITY_MULTIPLIERS = {
  mumbai: 25000,
  delhi: 18000,
  bangalore: 12000,
  pune: 10000,
  hyderabad: 9000,
  chennai: 11000,
  gurgaon: 15000,
  noida: 8000,
  kolkata: 7000,
  ahmedabad: 6000,
};

// Property type multipliers
const PROPERTY_TYPE_MULTIPLIERS = {
  apartment: 1.0,
  villa: 1.5,
  duplex: 1.3,
  penthouse: 2.0,
  studio: 0.7,
  'builder-floor': 1.1,
};

// Furnishing multipliers
const FURNISHING_MULTIPLIERS = {
  unfurnished: 1.0,
  'semi-furnished': 1.1,
  'fully-furnished': 1.25,
};

// Amenity values (additional price per sq ft)
const AMENITY_VALUES = {
  parking: 500,
  gym: 800,
  'swimming-pool': 1200,
  security: 300,
  'power-backup': 400,
  elevator: 600,
  garden: 700,
  'club-house': 900,
  'children-play-area': 400,
  'shopping-center': 600,
};

class LinearRegression {
  private weights: number[] = [];
  private bias: number = 0;
  private trained: boolean = false;

  // Training data generation based on realistic Indian market patterns
  private generateTrainingData(samples: number = 1000): { X: number[][]; y: number[] } {
    const X: number[][] = [];
    const y: number[] = [];

    for (let i = 0; i < samples; i++) {
      const area = 500 + Math.random() * 3000; // 500-3500 sq ft
      const bedrooms = Math.floor(1 + Math.random() * 4); // 1-4 bedrooms
      const bathrooms = Math.floor(1 + Math.random() * 3); // 1-3 bathrooms
      const age = Math.random() * 30; // 0-30 years
      const floor = Math.floor(1 + Math.random() * 20); // 1-20 floors
      
      // Random city selection
      const cities = Object.keys(CITY_MULTIPLIERS);
      const cityMultiplier = CITY_MULTIPLIERS[cities[Math.floor(Math.random() * cities.length)] as keyof typeof CITY_MULTIPLIERS];
      
      // Random property type
      const propertyTypes = Object.keys(PROPERTY_TYPE_MULTIPLIERS);
      const propertyMultiplier = PROPERTY_TYPE_MULTIPLIERS[propertyTypes[Math.floor(Math.random() * propertyTypes.length)] as keyof typeof PROPERTY_TYPE_MULTIPLIERS];
      
      // Random furnishing
      const furnishingTypes = Object.keys(FURNISHING_MULTIPLIERS);
      const furnishingMultiplier = FURNISHING_MULTIPLIERS[furnishingTypes[Math.floor(Math.random() * furnishingTypes.length)] as keyof typeof FURNISHING_MULTIPLIERS];
      
      // Random amenities
      const amenitiesCount = Math.floor(Math.random() * 5);
      const amenitiesValue = amenitiesCount * 500; // Simplified amenities value
      
      // Feature vector
      const features = [
        area,
        bedrooms,
        bathrooms,
        age,
        floor,
        cityMultiplier / 10000, // Normalized
        propertyMultiplier,
        furnishingMultiplier,
        amenitiesValue / 1000, // Normalized
      ];
      
      // Price calculation with some noise
      const basePrice = area * cityMultiplier * propertyMultiplier * furnishingMultiplier;
      const ageDiscount = Math.max(0.7, 1 - (age * 0.02)); // Age depreciation
      const floorBonus = floor > 10 ? 1.1 : 1.0; // Higher floor bonus
      const amenitiesBonus = amenitiesValue;
      
      const price = (basePrice * ageDiscount * floorBonus + amenitiesBonus) * (0.8 + Math.random() * 0.4); // Add noise
      
      X.push(features);
      y.push(price);
    }
    
    return { X, y };
  }

  // Matrix operations
  private matrixMultiply(A: number[][], B: number[][]): number[][] {
    const result: number[][] = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < B[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < B.length; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  private matrixTranspose(matrix: number[][]): number[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  private matrixInverse(matrix: number[][]): number[][] {
    const n = matrix.length;
    const identity = Array(n).fill(0).map((_, i) => Array(n).fill(0).map((_, j) => i === j ? 1 : 0));
    const augmented = matrix.map((row, i) => [...row, ...identity[i]]);

    // Gaussian elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

      // Make diagonal 1
      const pivot = augmented[i][i];
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }

      // Eliminate column
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }

    return augmented.map(row => row.slice(n));
  }

  train(): void {
    const { X, y } = this.generateTrainingData(2000);
    
    // Add bias column
    const XWithBias = X.map(row => [1, ...row]);
    
    // Normal equation: theta = (X^T * X)^(-1) * X^T * y
    const XT = this.matrixTranspose(XWithBias);
    const XTX = this.matrixMultiply(XT, XWithBias);
    const XTXInv = this.matrixInverse(XTX);
    const XTy = XT.map(row => row.reduce((sum, val, i) => sum + val * y[i], 0));
    
    const theta = this.matrixMultiply(XTXInv, [XTy])[0];
    
    this.bias = theta[0];
    this.weights = theta.slice(1);
    this.trained = true;
  }

  predict(features: PropertyFeatures): PredictionResult {
    if (!this.trained) {
      this.train();
    }

    const normalizedFeatures = this.normalizeFeatures(features);
    
    let prediction = this.bias;
    for (let i = 0; i < this.weights.length; i++) {
      prediction += this.weights[i] * normalizedFeatures[i];
    }

    // Ensure minimum price
    prediction = Math.max(prediction, 500000);

    // Calculate confidence based on feature quality
    const confidence = this.calculateConfidence(features);
    
    // Calculate price range (±20% based on confidence)
    const margin = prediction * (0.3 - confidence * 0.2);
    const priceRange = {
      min: Math.max(prediction - margin, prediction * 0.7),
      max: prediction + margin,
    };

    // Calculate feature breakdown
    const breakdown = this.calculateBreakdown(features, prediction);

    return {
      price: Math.round(prediction),
      confidence: Math.round(confidence * 100) / 100,
      priceRange: {
        min: Math.round(priceRange.min),
        max: Math.round(priceRange.max),
      },
      breakdown,
    };
  }

  private normalizeFeatures(features: PropertyFeatures): number[] {
    const cityMultiplier = CITY_MULTIPLIERS[features.location as keyof typeof CITY_MULTIPLIERS] || 8000;
    const propertyMultiplier = PROPERTY_TYPE_MULTIPLIERS[features.propertyType as keyof typeof PROPERTY_TYPE_MULTIPLIERS] || 1.0;
    const furnishingMultiplier = FURNISHING_MULTIPLIERS[features.furnishing as keyof typeof FURNISHING_MULTIPLIERS] || 1.0;
    
    const amenitiesValue = features.amenities.reduce((sum, amenity) => {
      return sum + (AMENITY_VALUES[amenity as keyof typeof AMENITY_VALUES] || 0);
    }, 0);

    return [
      features.area,
      features.bedrooms,
      features.bathrooms,
      features.age,
      features.floor,
      cityMultiplier / 10000,
      propertyMultiplier,
      furnishingMultiplier,
      amenitiesValue / 1000,
    ];
  }

  private calculateConfidence(features: PropertyFeatures): number {
    let confidence = 0.5; // Base confidence

    // Area confidence
    if (features.area >= 500 && features.area <= 3000) confidence += 0.2;
    
    // Location confidence
    if (features.location in CITY_MULTIPLIERS) confidence += 0.15;
    
    // Property type confidence
    if (features.propertyType in PROPERTY_TYPE_MULTIPLIERS) confidence += 0.1;
    
    // Age confidence
    if (features.age <= 15) confidence += 0.05;

    return Math.min(confidence, 0.95);
  }

  private calculateBreakdown(features: PropertyFeatures, totalPrice: number): { [key: string]: number } {
    const cityMultiplier = CITY_MULTIPLIERS[features.location as keyof typeof CITY_MULTIPLIERS] || 8000;
    const basePrice = features.area * cityMultiplier;
    
    const amenitiesValue = features.amenities.reduce((sum, amenity) => {
      return sum + (AMENITY_VALUES[amenity as keyof typeof AMENITY_VALUES] || 0) * features.area;
    }, 0);

    return {
      'Base Price (Area × Location)': Math.round(basePrice),
      'Property Type Adjustment': Math.round(basePrice * (PROPERTY_TYPE_MULTIPLIERS[features.propertyType as keyof typeof PROPERTY_TYPE_MULTIPLIERS] - 1)),
      'Furnishing Premium': Math.round(basePrice * (FURNISHING_MULTIPLIERS[features.furnishing as keyof typeof FURNISHING_MULTIPLIERS] - 1)),
      'Age Depreciation': Math.round(-basePrice * features.age * 0.02),
      'Floor Premium': Math.round(features.floor > 10 ? basePrice * 0.1 : 0),
      'Amenities Value': Math.round(amenitiesValue),
    };
  }
}

// Export singleton instance
export const mlModel = new LinearRegression();

// Currency formatting for INR
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Convert amount to lakh/crore format
export const formatINRShort = (amount: number): string => {
  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) { // 1 thousand
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};