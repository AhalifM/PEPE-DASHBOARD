import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, AlertCircle, CheckCircle, BarChart3, PieChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

const Credit = () => {
  // Mock business financial data
  const businessData = {
    creditScore: 780,
    creditScoreChange: +25,
    monthlyRevenue: 45000,
    revenueGrowth: 12.5,
    totalDebt: 15000,
    debtToIncomeRatio: 0.33,
    paymentHistory: 98.5,
    businessAge: 3.2, // years
    industryRisk: 'Low',
    eligibleLoans: [
      {
        type: 'Business Line of Credit',
        amount: 'RM 50,000',
        rate: '8.5%',
        term: 'Revolving',
        status: 'Pre-approved'
      },
      {
        type: 'Equipment Financing',
        amount: 'RM 100,000',
        rate: '6.8%',
        term: '3-5 years',
        status: 'Eligible'
      },
      {
        type: 'Working Capital Loan',
        amount: 'RM 75,000',
        rate: '9.2%',
        term: '1-2 years',
        status: 'Eligible'
      }
    ]
  };

  // Mock revenue trend data
  const revenueData = [
    { month: 'Jul', revenue: 38000, expenses: 25000 },
    { month: 'Aug', revenue: 42000, expenses: 27000 },
    { month: 'Sep', revenue: 39000, expenses: 26000 },
    { month: 'Oct', revenue: 44000, expenses: 28000 },
    { month: 'Nov', revenue: 41000, expenses: 27500 },
    { month: 'Dec', revenue: 45000, expenses: 29000 },
  ];

  // Mock credit score history
  const creditScoreData = [
    { month: 'Jul', score: 720 },
    { month: 'Aug', score: 735 },
    { month: 'Sep', score: 745 },
    { month: 'Oct', score: 760 },
    { month: 'Nov', score: 775 },
    { month: 'Dec', score: 780 },
  ];

  // Mock expense breakdown
  const expenseData = [
    { name: 'Inventory', value: 45, color: '#8884d8' },
    { name: 'Operations', value: 25, color: '#82ca9d' },
    { name: 'Marketing', value: 15, color: '#ffc658' },
    { name: 'Other', value: 15, color: '#ff7c7c' }
  ];

  const getCreditScoreColor = (score) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCreditScoreLevel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pre-approved': return 'bg-green-100 text-green-800';
      case 'Eligible': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout title="creditPEPE - Analytics & Credit Scoring">
      <div className="space-y-6">
        {/* Credit Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Credit Score</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-2xl font-bold ${getCreditScoreColor(businessData.creditScore)}`}>
                      {businessData.creditScore}
                    </p>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      +{businessData.creditScoreChange}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{getCreditScoreLevel(businessData.creditScore)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold">RM {businessData.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+{businessData.revenueGrowth}% growth</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Debt-to-Income</p>
                  <p className="text-2xl font-bold">{Math.round(businessData.debtToIncomeRatio * 100)}%</p>
                  <p className="text-xs text-muted-foreground">RM {businessData.totalDebt.toLocaleString()} total debt</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Payment History</p>
                  <p className="text-2xl font-bold">{businessData.paymentHistory}%</p>
                  <p className="text-xs text-green-600">Excellent record</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue & Expenses Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`RM ${value.toLocaleString()}`, '']} />
                    <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                    <Bar dataKey="expenses" name="Expenses" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Credit Score History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Credit Score Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={creditScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[650, 800]} />
                    <Tooltip formatter={(value) => [value, 'Credit Score']} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Health Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Business Health Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium mb-2">Cash Flow Stability</p>
                <Progress value={85} className="mb-2" />
                <p className="text-xs text-muted-foreground">85/100 - Strong and consistent</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Industry Risk Level</p>
                <Progress value={25} className="mb-2" />
                <p className="text-xs text-muted-foreground">Low Risk - Technology sector</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Business Maturity</p>
                <Progress value={65} className="mb-2" />
                <p className="text-xs text-muted-foreground">{businessData.businessAge} years in operation</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Asset Coverage</p>
                <Progress value={92} className="mb-2" />
                <p className="text-xs text-muted-foreground">92/100 - Excellent collateral</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Market Position</p>
                <Progress value={78} className="mb-2" />
                <p className="text-xs text-muted-foreground">Strong competitive advantage</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Growth Potential</p>
                <Progress value={88} className="mb-2" />
                <p className="text-xs text-muted-foreground">High growth trajectory</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Eligibility */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businessData.eligibleLoans.map((loan, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{loan.type}</h3>
                      <p className="text-2xl font-bold text-green-600">{loan.amount}</p>
                    </div>
                    <Badge className={getStatusColor(loan.status)}>
                      {loan.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Interest Rate</p>
                      <p className="font-medium">{loan.rate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Term</p>
                      <p className="font-medium">{loan.term}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      Apply Now
                    </Button>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Excellent Credit Position</p>
                    <p className="text-sm text-green-700">Your credit score is in the top 15%. Consider negotiating better rates with existing lenders.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Growth Opportunity</p>
                    <p className="text-sm text-blue-700">Revenue growth of 12.5% positions you well for expansion financing.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Optimize Cash Flow</p>
                    <p className="text-sm text-yellow-700">Consider invoice factoring to improve working capital during peak seasons.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Credit;