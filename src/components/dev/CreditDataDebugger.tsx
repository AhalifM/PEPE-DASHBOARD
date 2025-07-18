import React from 'react';
import { useShowcaseData, useShowcaseCreditScore } from '@/hooks/useShowcaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CreditDataDebugger = () => {
  const { 
    profile, 
    orders, 
    analytics, 
    loading, 
    error,
    businessName,
    businessId,
    isDemoMode 
  } = useShowcaseData();
  
  const { creditScore, creditCategory, aiFeatures } = useShowcaseCreditScore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Data Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold">Configuration:</h4>
          <div className="text-sm space-y-1">
            <p>Demo Mode: {isDemoMode ? 'Yes' : 'No'}</p>
            <p>Business ID: {businessId}</p>
            <p>Business Name: {businessName}</p>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Error: {error || 'None'}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Raw Data Counts:</h4>
          <div className="text-sm space-y-1">
            <p>Profile: {profile ? 'Loaded' : 'Not loaded'}</p>
            <p>Orders: {orders.length}</p>
            <p>Total Revenue: RM {analytics.totalRevenue.toLocaleString()}</p>
            <p>Total Orders: {analytics.totalOrders}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold">AI Features (Raw):</h4>
          <div className="text-sm space-y-1">
            <p>Customer Number: {aiFeatures.customer_number}</p>
            <p>Customer Order Ratio: {aiFeatures.customer_order.toFixed(2)}</p>
            <p>Total Amount: RM {aiFeatures.amount.toLocaleString()}</p>
            <p>Days Since Last Transaction: {aiFeatures.days_since_last_transaction}</p>
            <p>Customer Stickiness: {aiFeatures.customer_stickiness.toFixed(3)}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Credit Calculation:</h4>
          <div className="text-sm space-y-1">
            <p>Calculated Credit Score: {creditScore}</p>
            <p>Credit Category: {creditCategory}</p>
            <p>Profile Credit Score: {profile?.creditScore || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Sample Orders (First 3):</h4>
          <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
            {orders.slice(0, 3).map((order, i) => (
              <div key={i} className="border-l-2 border-gray-200 pl-2">
                <p>ID: {order.id}</p>
                <p>Customer: {order.customerName}</p>
                <p>Amount: RM {order.totalAmount}</p>
                <p>Products: {order.products.length} items</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditDataDebugger;
