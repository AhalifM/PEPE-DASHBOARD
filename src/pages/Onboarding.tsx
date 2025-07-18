import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, CheckCircle, CreditCard, FileText } from 'lucide-react';

const Onboarding = () => {
  const steps = [
    { id: 1, title: 'SSM Registration', icon: Building2, status: 'current' },
    { id: 2, title: 'Business Verification', icon: FileText, status: 'pending' },
    { id: 3, title: 'KYB Completion', icon: CheckCircle, status: 'pending' },
    { id: 4, title: 'Wallet Setup', icon: CreditCard, status: 'pending' },
  ];

  return (
    <PageLayout title="Business Onboarding" description="Complete your business setup from SSM to wallet ready">
      <div className="space-y-6">
        {/* Progress Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Progress</CardTitle>
            <CardDescription>Complete all steps to start using PEPE Business Platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center space-y-2">
                  <div className={`p-3 rounded-full ${
                    step.status === 'current' ? 'bg-[#e03b6d]/10 text-[#e03b6d]' : 
                    step.status === 'completed' ? 'bg-black/10 text-black' : 
                    'bg-gray-100 text-gray-400'
                  }`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{step.title}</p>
                    <Badge variant={
                      step.status === 'current' ? 'default' : 
                      step.status === 'completed' ? 'secondary' : 
                      'outline'
                    }>
                      {step.status}
                    </Badge>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block w-16 h-0.5 bg-gray-200 absolute translate-x-16" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SSM Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: SSM Registration</CardTitle>
            <CardDescription>Enter your Malaysian business SSM number to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ssm-number">SSM Registration Number</Label>
              <Input 
                id="ssm-number" 
                placeholder="e.g., 201901234567"
                className="max-w-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name (Auto-filled)</Label>
              <Input 
                id="business-name" 
                placeholder="Will be auto-populated after SSM verification"
                disabled
                className="max-w-md"
              />
            </div>
            <Button className="w-full max-w-md bg-[#e03b6d] hover:bg-[#c52d5a] text-white">
              Verify SSM & Continue
            </Button>
          </CardContent>
        </Card>

        {/* Next Steps Preview */}
        <Card>
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-[#e03b6d]" />
                <span>We'll automatically fetch and verify your business details</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-[#e03b6d]" />
                <span>Complete Know Your Business (KYB) documentation</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-[#e03b6d]" />
                <span>Set up your business wallet for payments</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-[#e03b6d]" />
                <span>Start accepting orders and managing your business</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Onboarding;
