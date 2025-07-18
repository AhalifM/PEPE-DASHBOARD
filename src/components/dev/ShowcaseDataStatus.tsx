import React from 'react';
import { useShowcaseData } from '@/hooks/useShowcaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ShowcaseDataStatus = () => {
  const { 
    profile, 
    orders, 
    invoices, 
    transactions, 
    creditApplications,
    analytics,
    loading, 
    error,
    businessName,
    businessId,
    isDemoMode
  } = useShowcaseData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Showcase Data Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading showcase data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Showcase Data Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const dataStatus = [
    { name: 'Business Profile', count: profile ? 1 : 0, expected: 1 },
    { name: 'Orders', count: orders.length, expected: '10+' },
    { name: 'Invoices', count: invoices.length, expected: '5+' },
    { name: 'Transactions', count: transactions.length, expected: '20+' },
    { name: 'Credit Applications', count: creditApplications.length, expected: '1+' }
  ];

  const getStatusIcon = (count: number, expected: string | number) => {
    const expectedNum = typeof expected === 'string' ? parseInt(expected) : expected;
    if (count >= expectedNum) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (count > 0) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Showcase Data Status</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant={isDemoMode ? "default" : "secondary"}>
            {isDemoMode ? "Demo Mode Active" : "Demo Mode Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isDemoMode && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">Active Business:</h4>
              <p className="text-blue-600">{businessName} (ID: {businessId})</p>
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="font-semibold">Data Collections:</h4>
            {dataStatus.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.count, item.expected)}
                  <span>{item.name}</span>
                </div>
                <Badge variant="outline">
                  {item.count} / {item.expected}
                </Badge>
              </div>
            ))}
          </div>

          {analytics && (
            <div className="space-y-2">
              <h4 className="font-semibold">Analytics Summary:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Revenue: RM {analytics.totalRevenue.toLocaleString()}</div>
                <div>Orders: {analytics.totalOrders}</div>
                <div>Customers: {new Set(orders.map(o => o.customerEmail)).size}</div>
                <div>Pending: RM {analytics.pendingAmount.toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShowcaseDataStatus;
