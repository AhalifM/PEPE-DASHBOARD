import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Star, 
  AlertTriangle, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  Phone,
  Mail,
  ShoppingBag
} from 'lucide-react';

const CrmPepe = () => {
  const customers = [
    {
      id: "CUST-001",
      name: "Ahmad Rahman",
      phone: "+60123456789",
      email: "ahmad@example.com",
      totalOrders: 15,
      totalSpent: 450.50,
      lastOrder: "2 days ago",
      category: "High Value",
      riskLevel: "low",
      engagement: 85,
      joinDate: "2023-08-15",
      avatar: "AR"
    },
    {
      id: "CUST-002",
      name: "Sarah Lee",
      phone: "+60198765432",
      email: "sarah.lee@example.com",
      totalOrders: 8,
      totalSpent: 210.80,
      lastOrder: "1 week ago",
      category: "Regular",
      riskLevel: "medium",
      engagement: 60,
      joinDate: "2023-11-22",
      avatar: "SL"
    },
    {
      id: "CUST-003",
      name: "Kumar Singh",
      phone: "+60187654321",
      email: "kumar.singh@example.com",
      totalOrders: 25,
      totalSpent: 780.90,
      lastOrder: "3 hours ago",
      category: "VIP",
      riskLevel: "low",
      engagement: 95,
      joinDate: "2023-06-10",
      avatar: "KS"
    },
    {
      id: "CUST-004",
      name: "Fatimah Ali",
      phone: "+60176543210",
      email: "fatimah@example.com",
      totalOrders: 3,
      totalSpent: 85.20,
      lastOrder: "3 weeks ago",
      category: "At Risk",
      riskLevel: "high",
      engagement: 25,
      joinDate: "2023-12-05",
      avatar: "FA"
    },
  ];

  const aiSuggestions = [
    {
      customerId: "CUST-002",
      customerName: "Sarah Lee",
      suggestion: "Send reminder in 3 days - she usually orders weekly",
      type: "engagement",
      priority: "medium",
      action: "reminder"
    },
    {
      customerId: "CUST-004",
      customerName: "Fatimah Ali",
      suggestion: "At risk of churning - offer 10% discount to re-engage",
      type: "retention",
      priority: "high",
      action: "discount"
    },
    {
      customerId: "CUST-001",
      customerName: "Ahmad Rahman",
      suggestion: "Frequent buyer - introduce premium menu items",
      type: "upsell",
      priority: "low",
      action: "upsell"
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'High Value': return 'bg-green-100 text-green-800';
      case 'Regular': return 'bg-blue-100 text-blue-800';
      case 'At Risk': return 'bg-red-100 text-red-800';
      case 'New': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <PageLayout title="crmPEPE" description="AI-driven customer retention and relationship management">
      <div className="space-y-6">
        {/* CRM Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.filter(c => c.category === 'VIP').length}
              </div>
              <p className="text-xs text-muted-foreground">High value segment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {customers.filter(c => c.category === 'At Risk').length}
              </div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(customers.reduce((sum, c) => sum + c.engagement, 0) / customers.length)}%
              </div>
              <p className="text-xs text-muted-foreground">Customer activity score</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-[#e03b6d] rounded-full animate-pulse"></div>
              <span>AI-Powered Suggestions</span>
            </CardTitle>
            <CardDescription>Smart recommendations to improve customer retention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{suggestion.customerName}</h4>
                        <Badge variant={suggestion.priority === 'high' ? 'destructive' : 
                                        suggestion.priority === 'medium' ? 'default' : 'secondary'}>
                          {suggestion.priority} priority
                        </Badge>
                        <Badge variant="outline">{suggestion.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{suggestion.suggestion}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm">
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Management Tabs */}
        <Tabs defaultValue="customers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="customers">All Customers</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Database</CardTitle>
                <CardDescription>Complete customer information and engagement history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <div key={customer.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{customer.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{customer.name}</h3>
                              <p className="text-sm text-muted-foreground">{customer.id}</p>
                            </div>
                            <Badge className={getCategoryColor(customer.category)}>
                              {customer.category}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Total Orders</p>
                              <p className="font-medium">{customer.totalOrders}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total Spent</p>
                              <p className="font-medium">RM {customer.totalSpent}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Last Order</p>
                              <p className="font-medium">{customer.lastOrder}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Engagement</p>
                              <div className="flex items-center space-x-2">
                                <Progress value={customer.engagement} className="w-16" />
                                <span className="font-medium">{customer.engagement}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3" />
                                <span>{customer.phone}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3" />
                                <span>{customer.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Joined {customer.joinDate}</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Chat
                              </Button>
                              <Button size="sm" variant="outline">
                                <ShoppingBag className="h-3 w-3 mr-1" />
                                Orders
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="segments" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-purple-600">VIP Customers</CardTitle>
                  <CardDescription>High-value customers with strong loyalty</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {customers.filter(c => c.category === 'VIP').length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Avg spend: RM {customers.filter(c => c.category === 'VIP')
                      .reduce((sum, c) => sum + c.totalSpent, 0) / 
                      customers.filter(c => c.category === 'VIP').length || 0}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">High Value</CardTitle>
                  <CardDescription>Customers with significant purchase history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {customers.filter(c => c.category === 'High Value').length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Regular purchasers with good engagement
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">At Risk</CardTitle>
                  <CardDescription>Customers who may churn soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {customers.filter(c => c.category === 'At Risk').length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Need immediate attention and re-engagement
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Analytics</CardTitle>
                <CardDescription>Customer activity and interaction patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {customers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{customer.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{customer.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {customer.totalOrders} orders • RM {customer.totalSpent} spent
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">Engagement Score</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={customer.engagement} className="w-20" />
                            <span className={`font-medium ${getRiskColor(customer.riskLevel)}`}>
                              {customer.engagement}%
                            </span>
                          </div>
                        </div>
                        <Badge className={getCategoryColor(customer.category)}>
                          {customer.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default CrmPepe;
