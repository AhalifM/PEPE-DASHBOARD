import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FirebaseService, { Order } from '@/lib/firebaseService';
import { SHOWCASE_CONFIG } from '@/lib/showcaseConfig';

interface DataResults {
  profile: boolean;
  profileData?: { businessName: string; creditScore?: number };
  orders: number;
  ordersData: Order[];
  invoices: number;
  transactions: number;
  creditApps: number;
  totalRevenue: number;
  error?: string;
}

const DataVerifier = () => {
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<DataResults | null>(null);

  const checkData = async () => {
    setChecking(true);
    try {
      console.log('🔍 Checking data for business:', SHOWCASE_CONFIG.BUSINESS_ID);
      
      const [profile, orders, invoices, transactions, creditApps] = await Promise.all([
        FirebaseService.getBusinessProfile(SHOWCASE_CONFIG.BUSINESS_ID),
        FirebaseService.getOrders(SHOWCASE_CONFIG.BUSINESS_ID),
        FirebaseService.getInvoices(SHOWCASE_CONFIG.BUSINESS_ID),
        FirebaseService.getTransactions(SHOWCASE_CONFIG.BUSINESS_ID),
        FirebaseService.getCreditApplications(SHOWCASE_CONFIG.BUSINESS_ID)
      ]);

      setResults({
        profile: !!profile,
        profileData: profile,
        orders: orders.length,
        ordersData: orders.slice(0, 2),
        invoices: invoices.length,
        transactions: transactions.length,
        creditApps: creditApps.length,
        totalRevenue: transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)
      });

      console.log('📊 Data check results:', {
        profile: !!profile,
        orders: orders.length,
        invoices: invoices.length,
        transactions: transactions.length,
        creditApps: creditApps.length
      });

    } catch (error) {
      console.error('❌ Error checking data:', error);
      setResults({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        profile: false,
        orders: 0,
        ordersData: [],
        invoices: 0,
        transactions: 0,
        creditApps: 0,
        totalRevenue: 0
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firebase Data Verifier</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">Business ID: {SHOWCASE_CONFIG.BUSINESS_ID}</Badge>
          <Badge variant={SHOWCASE_CONFIG.DEMO_MODE ? "default" : "secondary"}>
            Demo Mode: {SHOWCASE_CONFIG.DEMO_MODE ? 'ON' : 'OFF'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkData} disabled={checking}>
          {checking ? 'Checking...' : 'Check Firebase Data'}
        </Button>

        {results && (
          <div className="space-y-4">
            {results.error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 font-semibold">Error:</p>
                <p className="text-red-600">{results.error}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Profile</h4>
                    <p className="text-blue-600">{results.profile ? 'Found' : 'Not Found'}</p>
                    {results.profileData && (
                      <p className="text-xs text-blue-600">
                        Name: {results.profileData.businessName}
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800">Orders</h4>
                    <p className="text-green-600">{results.orders} found</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800">Invoices</h4>
                    <p className="text-purple-600">{results.invoices} found</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800">Transactions</h4>
                    <p className="text-orange-600">{results.transactions} found</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold">Calculated Revenue:</h4>
                  <p className="text-lg font-bold">RM {results.totalRevenue.toLocaleString()}</p>
                </div>

                {results.ordersData && results.ordersData.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Sample Orders:</h4>
                    {results.ordersData.map((order: Order, i: number) => (
                      <div key={i} className="text-sm border-l-2 border-gray-300 pl-2 mb-2">
                        <p>Customer: {order.customerName}</p>
                        <p>Amount: RM {order.totalAmount}</p>
                        <p>Products: {order.products?.length || 0} items</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataVerifier;
