import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { formatINR, formatINRShort } from '@/lib/ml-models';
import { Calculator, Percent, Calendar, PiggyBank } from 'lucide-react';

interface EMICalculatorProps {
  propertyPrice: number;
}

export function EMICalculator({ propertyPrice }: EMICalculatorProps) {
  const [downPayment, setDownPayment] = useState(propertyPrice * 0.2); // 20% default
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% default
  const [tenure, setTenure] = useState(20); // 20 years default

  const loanAmount = propertyPrice - downPayment;
  const monthlyRate = interestRate / (12 * 100);
  const totalMonths = tenure * 12;
  
  // EMI calculation using formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / 
              (Math.pow(1 + monthlyRate, totalMonths) - 1);
  
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  const downPaymentPercentage = (downPayment / propertyPrice) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          EMI Calculator
        </CardTitle>
        <CardDescription>
          Calculate your monthly EMI based on the predicted price
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Price Display */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Property Price</p>
            <p className="text-2xl font-bold text-primary">{formatINRShort(propertyPrice)}</p>
          </div>
        </div>

        {/* Down Payment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Down Payment
            </Label>
            <div className="text-right">
              <p className="font-semibold">{formatINRShort(downPayment)}</p>
              <p className="text-sm text-muted-foreground">
                {downPaymentPercentage.toFixed(1)}% of price
              </p>
            </div>
          </div>
          <Slider
            value={[downPaymentPercentage]}
            onValueChange={([value]) => setDownPayment(propertyPrice * (value / 100))}
            max={50}
            min={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Interest Rate (% per year)
            </Label>
            <p className="font-semibold">{interestRate.toFixed(1)}%</p>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={([value]) => setInterestRate(value)}
            max={15}
            min={6}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>6%</span>
            <span>15%</span>
          </div>
        </div>

        {/* Loan Tenure */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Loan Tenure (years)
            </Label>
            <p className="font-semibold">{tenure} years</p>
          </div>
          <Slider
            value={[tenure]}
            onValueChange={([value]) => setTenure(value)}
            max={30}
            min={5}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 years</span>
            <span>30 years</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-br from-ml-gradient-start/10 to-ml-gradient-end/10 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
            <p className="text-2xl font-bold text-primary">{formatINRShort(emi)}</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
            <p className="text-lg font-semibold">{formatINRShort(loanAmount)}</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
            <p className="text-lg font-semibold text-orange-600">{formatINRShort(totalInterest)}</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Payment</p>
            <p className="text-lg font-semibold">{formatINRShort(totalPayment)}</p>
          </div>
        </div>

        {/* EMI Breakdown */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">EMI Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Principal amount per month:</span>
              <span className="font-medium">{formatINRShort(emi - (loanAmount * monthlyRate))}</span>
            </div>
            <div className="flex justify-between">
              <span>Interest amount per month:</span>
              <span className="font-medium">{formatINRShort(loanAmount * monthlyRate)}</span>
            </div>
            <div className="flex justify-between">
              <span>EMI to Income ratio (recommended &lt;30%):</span>
              <span className="font-medium">Calculate based on your income</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}