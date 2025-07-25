import { useState, useCallback } from 'react';
import { mlModel, PropertyFeatures, PredictionResult } from '@/lib/ml-models';

export const usePrediction = () => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(async (features: PropertyFeatures) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = mlModel.predict(features);
      setPrediction(result);
    } catch (err) {
      setError('Failed to predict price. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearPrediction = useCallback(() => {
    setPrediction(null);
    setError(null);
  }, []);

  return {
    prediction,
    isLoading,
    error,
    predict,
    clearPrediction,
  };
};