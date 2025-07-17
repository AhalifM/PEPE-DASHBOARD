import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Star, Heart, AlertTriangle, TrendingUp, MessageSquare, Phone, Mail, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const CRM = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Mock customer data with engagement metrics
  const customers = [
    {
      id: 1,
      name: 'Ahmad Rahman',
      phone: '+60123456789',
      email: 'ahmad@email.com',
      totalSpent: 8500.00,
      lastOrder: '2024-01-15',
      orderCount: 5,
      engagementScore: 92,
      category: 'High Value',
      riskLevel: 'Low',
      tags: ['Frequent Buyer', 'Tech Enthusiast'],
      aiSuggestion: 'Send new product catalog - high likelihood of purchase',
      lastContact: '2024-01-10',
      notes: 'Prefers premium products, always pays on time'
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      phone: '+60198765432',
      email: 'siti@email.com',
      totalSpent: 4899.00,
      lastOrder: '2024-01-14',
      orderCount: 2,
      engagementScore: 78,
      category: 'Regular',
      riskLevel: 'Low',
      tags: ['Mobile Devices'],
      aiSuggestion: 'Offer accessories for recent iPhone purchase',
      lastContact: '2024-01-12',
      notes: 'Quick decision maker, responds well to promotions'
    },
    {
      id: 3,
      name: 'John Tan',
      phone: '+60167890123',
      email: 'john@email.com',
      totalSpent: 3200.00,
      lastOrder: '2024-01-13',
      orderCount: 3,
      engagementScore: 65,
      category: 'Regular',
      riskLevel: 'Medium',
      tags: ['Office Equipment'],
      aiSuggestion: 'Follow up on pending payment',
      lastContact: '2024-01-08',
      notes: 'Sometimes slow to respond, prefers email communication'
    },
    {
      id: 4,
      name: 'Mary Wong',
      phone: '+60156789012',
      email: 'mary@email.com',
      totalSpent: 1200.00,
      lastOrder: '2023-12-20',
      orderCount: 1,
      engagementScore: 35,
      category: 'At Risk',
      riskLevel: 'High',
      tags: ['New Customer'],
      aiSuggestion: 'Send re-engagement campaign - offer 10% discount',
      lastContact: '2023-12-22',
      notes: 'Single purchase, no follow-up response'
    },
    {
      id: 5,
      name: 'David Lim',
      phone: '+60145678901',
      email: 'david@email.com',
      totalSpent: 6800.00,
      lastOrder: '2024-01-11',
      orderCount: 4,
      engagementScore: 88,
      category: 'High Value',
      riskLevel: 'Low',
      tags: ['Gaming', 'Early Adopter'],
      aiSuggestion: 'Invite to VIP program - eligible for premium benefits',
      lastContact: '2024-01-09',
      notes: 'Gaming enthusiast, interested in latest tech'
    }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'High Value': return 'bg-green-100 text-green-800';
      case 'Regular': return 'bg-blue-100 text-blue-800';
      case 'At Risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return <Star className="h-4 w-4 text-green-500" />;
      case 'Medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'High': return <Heart className="h-4 w-4 text-red-500" />;
      default: return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const totalCustomers = customers.length;
  const highValueCustomers = customers.filter(c => c.category === 'High Value').length;
  const atRiskCustomers = customers.filter(c => c.category === 'At Risk').length;
  const avgEngagement = Math.round(customers.reduce((sum, c) => sum + c.engagementScore, 0) / customers.length);

  return (
    <PageLayout title="crmPEPE - Customer Retention">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold">{totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">High Value</p>
                  <p className="text-2xl font-bold">{highValueCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">At Risk</p>
                  <p className="text-2xl font-bold">{atRiskCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Engagement</p>
                  <p className="text-2xl font-bold">{avgEngagement}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Customer Database</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Customer Name</Label>
                      <Input id="name" placeholder="Enter customer name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="+60123456789" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="customer@email.com" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" placeholder="Customer preferences, notes..." />
                    </div>
                    <Button className="w-full">Add Customer</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="border rounded-lg p-4 hover:bg-muted/25 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getRiskIcon(customer.riskLevel)}
                        <div>
                          <h3 className="font-medium">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(customer.category)}>
                        {customer.category}
                      </Badge>
                      <span className="text-sm font-medium">
                        Engagement: {customer.engagementScore}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="font-medium">RM {customer.totalSpent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Orders</p>
                      <p className="font-medium">{customer.orderCount} orders</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Order</p>
                      <p className="font-medium">{customer.lastOrder}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                    <p className="text-sm font-medium text-blue-800">AI Suggestion:</p>
                    <p className="text-sm text-blue-700">{customer.aiSuggestion}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Last contact: {customer.lastContact}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Driven Retention Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Recommended Actions</h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Send re-engagement campaign</p>
                    <p className="text-xs text-muted-foreground">4 customers haven't ordered in 30+ days</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">VIP program invitations</p>
                    <p className="text-xs text-muted-foreground">2 customers qualify for premium benefits</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Follow up on high-value prospects</p>
                    <p className="text-xs text-muted-foreground">3 customers showing buying signals</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Retention Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Customer Retention Rate</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Customer Lifetime</span>
                    <span className="font-medium">18 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Repeat Purchase Rate</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Churn Risk Score</span>
                    <span className="font-medium text-yellow-600">Medium</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CRM;