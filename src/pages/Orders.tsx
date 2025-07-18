import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useShowcaseData } from '@/hooks/useShowcaseData';
import { MessageSquare, Send, Phone, Download, Eye } from 'lucide-react';

const Orders = () => {
  const { orders, loading, error, businessName, isDemoMode } = useShowcaseData();

  if (loading) {
    return (
      <PageLayout title="Orders" description="Loading orders...">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Orders" description="Error loading data">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  const formatCurrency = (amount: number) => `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Transform Firebase orders to display format
  const displayOrders = orders
    .sort((a, b) => b.orderDate.toDate().getTime() - a.orderDate.toDate().getTime())
    .map(order => ({
      id: order.id || 'N/A',
      customer: order.customerName,
      phone: order.customerEmail, // Using email as phone placeholder
      items: order.products.map(p => `${p.quantity}x ${p.name}`).join(', '),
      amount: formatCurrency(order.totalAmount),
      status: order.status,
      time: getTimeAgo(order.orderDate.toDate()),
      source: Math.random() > 0.5 ? "whatsapp" : "chat" // Random source for demo
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout 
      title={isDemoMode ? `${businessName} - Orders` : "Chat-Based Orders"} 
      description={isDemoMode ? `Order management for ${businessName}` : "Manage orders from WhatsApp and embedded chat"}
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Send order templates and manage chat preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>New WhatsApp Order</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Send Menu Template</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Call Customer</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Chat Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Live Chat Orders</CardTitle>
            <CardDescription>Real-time chat interface for taking orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 h-64 bg-gray-50 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2" />
                <p>Chat interface will appear here</p>
                <p className="text-sm">Integrate with WhatsApp Business API or embedded chat widget</p>
              </div>
            </div>
            <div className="flex mt-4 space-x-2">
              <Input placeholder="Type a message or use quick replies..." className="flex-1" />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>All orders from chat channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{order.customer}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Badge variant="outline">
                          {order.source === 'whatsapp' ? 'WhatsApp' : 'Web Chat'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.phone}</p>
                      <p className="text-sm">{order.items}</p>
                      <p className="text-xs text-muted-foreground">{order.id} • {order.time}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-bold text-lg">{order.amount}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Order Templates</CardTitle>
            <CardDescription>Pre-built templates for common orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <h4 className="font-medium">Breakfast Combo</h4>
                <p className="text-sm text-muted-foreground">2x Roti Canai + Teh Tarik</p>
                <p className="font-bold mt-2">RM 8.50</p>
              </div>
              <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <h4 className="font-medium">Lunch Set</h4>
                <p className="text-sm text-muted-foreground">Nasi Lemak + Drink</p>
                <p className="font-bold mt-2">RM 12.00</p>
              </div>
              <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <h4 className="font-medium">Family Pack</h4>
                <p className="text-sm text-muted-foreground">4x Rice + 2x Drinks</p>
                <p className="font-bold mt-2">RM 35.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Orders;
