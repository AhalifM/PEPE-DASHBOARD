import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Building, User, CreditCard, Shield } from 'lucide-react';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ssmNumber, setSsmNumber] = useState('');
  const [businessData, setBusinessData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const steps = [
    { id: 1, title: 'SSM Registration', icon: Building, status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'pending' },
    { id: 2, title: 'Business Verification', icon: Shield, status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'pending' },
    { id: 3, title: 'KYB Process', icon: User, status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'pending' },
    { id: 4, title: 'Wallet Creation', icon: CreditCard, status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'current' : 'pending' }
  ];

  const handleSSMSubmit = () => {
    // Mock SSM verification
    setBusinessData({
      name: 'Tech Solutions Sdn Bhd',
      registrationNumber: ssmNumber,
      type: 'Private Limited Company',
      address: 'Kuala Lumpur, Malaysia',
      establishedDate: '2020-01-15',
      status: 'Active'
    });
    setIsVerified(true);
    setCurrentStep(2);
  };

  const getStepIcon = (step) => {
    if (step.status === 'completed') return <CheckCircle className="h-6 w-6 text-green-500" />;
    if (step.status === 'current') return <step.icon className="h-6 w-6 text-blue-500" />;
    return <Circle className="h-6 w-6 text-gray-300" />;
  };

  return (
    <PageLayout title="User Onboarding">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Business Registration Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className="flex items-center">
                    {getStepIcon(step)}
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 ml-2 ${step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    )}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${step.status === 'current' ? 'text-blue-500' : step.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 1: SSM Registration */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                SSM Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ssm">SSM Registration Number</Label>
                <Input
                  id="ssm"
                  placeholder="Enter your SSM number (e.g., 202001234567)"
                  value={ssmNumber}
                  onChange={(e) => setSsmNumber(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleSSMSubmit} 
                disabled={!ssmNumber}
                className="w-full"
              >
                Verify SSM Registration
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Business Verification */}
        {currentStep === 2 && businessData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Business Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Business Name</Label>
                  <div className="p-2 bg-muted rounded">{businessData.name}</div>
                </div>
                <div>
                  <Label>Registration Number</Label>
                  <div className="p-2 bg-muted rounded">{businessData.registrationNumber}</div>
                </div>
                <div>
                  <Label>Business Type</Label>
                  <div className="p-2 bg-muted rounded">{businessData.type}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="p-2 bg-muted rounded">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {businessData.status}
                    </Badge>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label>Registered Address</Label>
                  <div className="p-2 bg-muted rounded">{businessData.address}</div>
                </div>
              </div>
              <Button 
                onClick={() => setCurrentStep(3)} 
                className="w-full"
              >
                Confirm Business Details
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: KYB Process */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Know Your Business (KYB)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="director">Director Name</Label>
                  <Input id="director" placeholder="Enter director's name" />
                </div>
                <div>
                  <Label htmlFor="ic">IC Number</Label>
                  <Input id="ic" placeholder="Enter IC number" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
              </div>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground">Upload required documents:</p>
                <p className="text-xs text-muted-foreground mt-1">
                  • Copy of IC (Director)<br />
                  • SSM Certificate<br />
                  • Bank Statement (Last 3 months)
                </p>
                <Button variant="outline" className="mt-4">
                  Upload Documents
                </Button>
              </div>
              <Button onClick={() => setCurrentStep(4)} className="w-full">
                Complete KYB Process
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Wallet Creation */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Wallet Creation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Business Account Ready!</h3>
                <p className="text-muted-foreground">Your digital wallet has been created successfully.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Account ID</h4>
                  <p className="text-sm text-muted-foreground">BIZ-{businessData?.registrationNumber}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Wallet Balance</h4>
                  <p className="text-sm text-muted-foreground">RM 0.00</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Next Steps:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Set up your payment methods</li>
                  <li>• Configure your business profile</li>
                  <li>• Start accepting orders through chat</li>
                  <li>• Generate your first invoice</li>
                </ul>
              </div>

              <Button className="w-full" onClick={() => window.location.href = '/'}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default Onboarding;