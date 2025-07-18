import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DatabaseInitializer from '@/components/dev/DatabaseInitializer';
import ShowcaseDataStatus from '@/components/dev/ShowcaseDataStatus';
import { useShowcaseData, useShowcaseCreditScore } from '@/hooks/useShowcaseData';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  CreditCard,
  MessageSquare,
  FileText,
  BarChart3,
  Star
} from 'lucide-react';

const Dashboard = () => {
  const { 
    profile, 
    orders, 
    analytics, 
    loading, 
    error, 
    businessName,
    isDemoMode 
  } = useShowcaseData();
  
  const { creditScore, creditCategory } = useShowcaseCreditScore();

  if (loading) {
    return (
      <PageLayout title="Dashboard" description="Loading business data...">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Dashboard" description="Error loading data">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  const formatCurrency = (amount: number) => `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(analytics.totalRevenue),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Active Orders",
      value: analytics.ordersThisMonth.toString(),
      change: `+${Math.round((analytics.ordersThisMonth / Math.max(analytics.totalOrders - analytics.ordersThisMonth, 1)) * 100)}%`,
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      value: new Set(orders.map(o => o.customerEmail)).size.toString(),
      change: "+8.2%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Pending Payments",
      value: formatCurrency(analytics.pendingAmount),
      change: "-5.1%",
      trend: analytics.pendingAmount > 0 ? "down" : "up",
      icon: CreditCard,
    },
  ];

  // Get recent orders (last 5)
  const recentOrders = orders
    .sort((a, b) => b.orderDate.toDate().getTime() - a.orderDate.toDate().getTime())
    .slice(0, 5)
    .map(order => ({
      id: order.id || 'N/A',
      customer: order.customerName,
      amount: formatCurrency(order.totalAmount),
      status: order.status,
      time: getTimeAgo(order.orderDate.toDate())
    }));

  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  const getCreditScoreColor = (score: number) => {
    if (score >= 720) return 'text-green-600';
    if (score >= 660) return 'text-blue-600';
    if (score >= 580) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCreditCategoryText = (category: string) => {
    switch (category) {
      case 'excellent': return 'Excellent credit profile. Eligible for all premium features.';
      case 'good': return 'Good credit standing. Access to most features.';
      case 'at_risk': return 'Monitor payment patterns. Some features may be limited.';
      case 'poor': return 'Needs improvement. Focus on payment consistency.';
      default: return 'Credit assessment in progress.';
    }
  };

  const quickActions = [
    { title: "New Chat Order", icon: MessageSquare, color: "bg-[#e03b6d]", href: "/orders" },
    { title: "Generate Invoice", icon: FileText, color: "bg-black", href: "/invoicing" },
    { title: "View Analytics", icon: BarChart3, color: "bg-[#e03b6d]", href: "/credit-pepe" },
    { title: "Manage CRM", icon: Star, color: "bg-black", href: "/crm-pepe" },
  ];

  return (
    <PageLayout 
      title={isDemoMode ? `${businessName} - Dashboard` : "Dashboard"} 
      description={isDemoMode ? `Overview of ${businessName} performance` : "Overview of your business performance"}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    asChild
                  >
                    <a href={action.href}>
                      <div className={`p-2 rounded-full ${action.color} text-white`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm">{action.title}</span>
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.id} • {order.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.amount}</p>
                      <Badge variant={
                        order.status === 'completed' ? 'default' :
                        order.status === 'pending' ? 'secondary' :
                        order.status === 'processing' ? 'outline' :
                        'destructive'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Orders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Business Health Score */}
        <Card>
          <CardHeader>
            <CardTitle>Business Health Score - {isDemoMode ? businessName : 'Your Business'}</CardTitle>
            <CardDescription>AI-powered insights from creditPEPE</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className={`text-2xl font-bold ${getCreditScoreColor(creditScore)}`}>
                    {creditScore}/900
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#e03b6d] h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(creditScore / 900) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {getCreditCategoryText(creditCategory)}
                </p>
                {isDemoMode && (
                  <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-medium">Customers:</span> {analytics.totalOrders > 0 ? new Set(orders.map(o => o.customerEmail)).size : 0}
                    </div>
                    <div>
                      <span className="font-medium">Orders:</span> {analytics.totalOrders}
                    </div>
                    <div>
                      <span className="font-medium">Revenue:</span> {formatCurrency(analytics.totalRevenue)}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {creditCategory.charAt(0).toUpperCase() + creditCategory.slice(1)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Development Tools - Database Initializer & Showcase Status */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold">Development Tools</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          <ShowcaseDataStatus />
          <DatabaseInitializer />
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
