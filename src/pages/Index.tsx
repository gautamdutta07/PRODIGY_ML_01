import { useState } from 'react';
import { PredictionForm } from '@/components/prediction-form';
import { PredictionResult } from '@/components/prediction-result';
import { EMICalculator } from '@/components/emi-calculator';
import { usePrediction } from '@/hooks/use-prediction';
import { PropertyFeatures } from '@/lib/ml-models';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Brain, Home, Calculator, TrendingUp, Sparkles, IndianRupee, BarChart3, Target } from 'lucide-react';

const Index = () => {
  const { prediction, isLoading, error, predict, clearPrediction } = usePrediction();
  const [activeTab, setActiveTab] = useState('predict');

  const handlePrediction = async (features: PropertyFeatures) => {
    try {
      await predict(features);
      setActiveTab('result');
      toast({
        title: "Prediction Complete!",
        description: "Your house price has been calculated using machine learning.",
      });
    } catch (err) {
      toast({
        title: "Prediction Failed",
        description: "Please try again with valid property details.",
        variant: "destructive",
      });
    }
  };

  const handleNewPrediction = () => {
    clearPrediction();
    setActiveTab('predict');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Brain className="h-12 w-12 text-primary" />
              <Sparkles className="h-6 w-6 text-accent absolute -top-1 -right-1" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-ml-gradient-start to-ml-gradient-end bg-clip-text text-transparent">
              AI House Price Predictor
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Get accurate house price predictions in India using advanced machine learning algorithms. 
            Powered by comprehensive market data and AI.
          </p>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Badge variant="secondary" className="text-sm">
              <IndianRupee className="h-3 w-3 mr-1" />
              INR Currency
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Brain className="h-3 w-3 mr-1" />
              Machine Learning
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <BarChart3 className="h-3 w-3 mr-1" />
              Market Analysis
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Target className="h-3 w-3 mr-1" />
              High Accuracy
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Home className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">10+</div>
              <div className="text-sm text-muted-foreground">Major Cities</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">Live</div>
              <div className="text-sm text-muted-foreground">Market Data</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Calculator className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">EMI</div>
              <div className="text-sm text-muted-foreground">Calculator</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="predict" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Predict
            </TabsTrigger>
            <TabsTrigger value="result" disabled={!prediction}>
              <BarChart3 className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="emi" disabled={!prediction}>
              <Calculator className="h-4 w-4" />
              EMI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predict" className="space-y-6">
            <PredictionForm onSubmit={handlePrediction} isLoading={isLoading} />
            
            {error && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="text-center text-destructive">{error}</div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="result" className="space-y-6">
            {prediction && (
              <>
                <PredictionResult result={prediction} />
                <div className="flex justify-center">
                  <Button 
                    onClick={handleNewPrediction}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    New Prediction
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="emi" className="space-y-6">
            {prediction && (
              <>
                <EMICalculator propertyPrice={prediction.price} />
                <div className="flex justify-center">
                  <Button 
                    onClick={handleNewPrediction}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    New Prediction
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* How it works section */}
        <Card className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">How Our AI Prediction Works</CardTitle>
            <CardDescription>
              Advanced machine learning technology for accurate price predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Machine Learning Model</h3>
                <p className="text-sm text-muted-foreground">
                  Trained on thousands of property transactions across major Indian cities
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Market Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time analysis of location, amenities, and property characteristics
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Accurate Predictions</h3>
                <p className="text-sm text-muted-foreground">
                  Confidence-based predictions with detailed price breakdowns
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
