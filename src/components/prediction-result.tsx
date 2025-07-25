import { type PredictionResult, formatINR, formatINRShort } from '@/lib/ml-models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, Home } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface PredictionResultComponentProps {
  result: PredictionResult;
}

const COLORS = ['#F97316', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

export function PredictionResult({ result }: PredictionResultComponentProps) {
  const { price, confidence, priceRange, breakdown } = result;

  // Prepare data for charts
  const breakdownData = Object.entries(breakdown)
    .filter(([_, value]) => Math.abs(value) > 0)
    .map(([name, value], index) => ({
      name: name.replace(/[()]/g, ''),
      value: Math.abs(value),
      color: COLORS[index % COLORS.length],
      isNegative: value < 0,
    }));

  const priceRangeData = [
    { name: 'Minimum', price: priceRange.min },
    { name: 'Predicted', price: price },
    { name: 'Maximum', price: priceRange.max },
  ];

  const confidenceColor = confidence >= 0.8 ? 'ml-success' : confidence >= 0.6 ? 'ml-warning' : 'destructive';

  return (
    <div className="space-y-6">
      {/* Main Price Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-3xl">
            <Home className="h-8 w-8 text-primary" />
            Predicted Price
          </CardTitle>
          <div className="text-5xl font-bold bg-gradient-to-r from-ml-gradient-start to-ml-gradient-end bg-clip-text text-transparent">
            {formatINR(price)}
          </div>
          <div className="text-xl text-muted-foreground">
            {formatINRShort(price)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price Range */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                <span className="text-sm text-muted-foreground">Minimum</span>
              </div>
              <div className="text-lg font-semibold">{formatINRShort(priceRange.min)}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Confidence</span>
              </div>
              <Badge variant="outline" className={`text-${confidenceColor} border-${confidenceColor}`}>
                {(confidence * 100).toFixed(0)}%
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <TrendingUp className="h-4 w-4 text-ml-success" />
                <span className="text-sm text-muted-foreground">Maximum</span>
              </div>
              <div className="text-lg font-semibold">{formatINRShort(priceRange.max)}</div>
            </div>
          </div>
          
          {/* Confidence Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Prediction Confidence</span>
              <span>{(confidence * 100).toFixed(0)}%</span>
            </div>
            <Progress value={confidence * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Range Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Price Range Analysis
            </CardTitle>
            <CardDescription>
              Predicted price with confidence interval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priceRangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatINRShort(value)} />
                <Tooltip formatter={(value) => [formatINRShort(value as number), 'Price']} />
                <Bar dataKey="price" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Price Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Price Breakdown
            </CardTitle>
            <CardDescription>
              How different factors contribute to the price
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatINRShort(value as number), 'Value']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Price Breakdown</CardTitle>
          <CardDescription>
            How each factor affects the final price
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(breakdown).map(([factor, value]) => (
              <div key={factor} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${value >= 0 ? 'bg-ml-success' : 'bg-destructive'}`} />
                  <span className="font-medium">{factor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${value >= 0 ? 'text-ml-success' : 'text-destructive'}`}>
                    {value >= 0 ? '+' : ''}{formatINRShort(value)}
                  </span>
                  {value >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-ml-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-300">Market Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Price per sq ft</h4>
              <p>{formatINR(Math.round(price / (breakdownData.find(d => d.name.includes('Area'))?.value || 1000)))}</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Investment Recommendation</h4>
              <p className={confidence >= 0.8 ? 'text-ml-success' : confidence >= 0.6 ? 'text-ml-warning' : 'text-destructive'}>
                {confidence >= 0.8 ? 'Excellent investment opportunity' : 
                 confidence >= 0.6 ? 'Good investment with moderate risk' : 
                 'High risk investment - proceed with caution'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}