
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, MessageSquare, FileText, CreditCard, Users, BarChart3 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  // Auto-redirect to dashboard (you can remove this if you want a proper landing page)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const features = [
    {
      title: 'Business Onboarding',
      description: 'SSM to wallet ready in minutes',
      icon: Building2,
      href: '/onboarding'
    },
    {
      title: 'Chat-Based Orders',
      description: 'WhatsApp and embedded chat ordering',
      icon: MessageSquare,
      href: '/orders'
    },
    {
      title: 'Auto e-Invoicing',
      description: 'Generate receipts automatically',
      icon: FileText,
      href: '/invoicing'
    },
    {
      title: 'Transaction Management',
      description: 'Complete payment tracking',
      icon: CreditCard,
      href: '/transactions'
    },
    {
      title: 'crmPEPE',
      description: 'AI-driven customer retention',
      icon: Users,
      href: '/crm-pepe'
    },
    {
      title: 'creditPEPE',
      description: 'Analytics and credit scoring',
      icon: BarChart3,
      href: '/credit-pepe'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-4">
            PEPE Business Platform
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Complete Business Management Platform - From SSM Registration to Payment Processing
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-[#e03b6d] hover:bg-[#c52d5a] text-white" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
            <Button size="lg" variant="outline" className="border-[#e03b6d] text-[#e03b6d] hover:bg-[#e03b6d] hover:text-white" onClick={() => navigate('/onboarding')}>
              Start Onboarding
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Redirecting to dashboard in 3 seconds...
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" 
                  onClick={() => navigate(feature.href)}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#e03b6d]/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-[#e03b6d]" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black mb-8">
            Everything you need to run your business
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#e03b6d]">Fast Setup</h3>
              <p className="text-gray-700">Get from SSM registration to accepting payments in minutes</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#e03b6d]">AI-Powered</h3>
              <p className="text-gray-700">Smart insights for customer retention and business growth</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#e03b6d]">All-in-One</h3>
              <p className="text-gray-700">Orders, payments, CRM, and analytics in one platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
