import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useShowcaseData, useShowcaseCreditScore } from '@/hooks/useShowcaseData';
import { useBusinessSwitcher } from '@/hooks/useBusinessSwitcher';
import { BusinessSwitcher } from '@/components/ui/BusinessSwitcher';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Calendar,
  Repeat,
  BarChart3
} from 'lucide-react';

const CreditPepe = () => {
  const { availableBusinesses, currentBusinessId, switchBusiness } = useBusinessSwitcher();
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  
  // Update selectedBusinessId when currentBusinessId changes from the business switcher
  useEffect(() => {
    if (currentBusinessId && !selectedBusinessId) {
      setSelectedBusinessId(currentBusinessId);
    }
  }, [currentBusinessId, selectedBusinessId]);

  const handleBusinessChange = (businessId: string) => {
    setSelectedBusinessId(businessId);
    switchBusiness(businessId);
  };

  const { analytics, loading, error, businessName, isDemoMode } = useShowcaseData(selectedBusinessId);
  const { creditScore, creditCategory, aiFeatures } = useShowcaseCreditScore(selectedBusinessId);

  if (loading) {
    return (
      <PageLayout title="Credit Score Prediction" description="Loading credit analysis...">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-20" />
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
      <PageLayout title="Credit Score Prediction" description="Error loading data">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  const formatCurrency = (amount: number) => `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 600) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 500) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getCreditCategory = (score: number) => {
    if (score >= 750) return { label: 'Excellent', range: '750 - 900' };
    if (score >= 600) return { label: 'Good / Stable', range: '600 - 749' };
    if (score >= 500) return { label: 'At Risk', range: '500 - 599' };
    return { label: 'Poor / Critical', range: '< 500' };
  };

  const getCreditScoreIndicatorColor = (score: number) => {
    if (score >= 750) return 'bg-green-500';
    if (score >= 600) return 'bg-yellow-500';
    if (score >= 500) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <PageLayout 
      title={isDemoMode ? `${businessName} - Credit Score Analysis` : "Credit Score Analysis"} 
      description={isDemoMode ? `AI-powered credit assessment for ${businessName}` : "AI-powered credit score prediction and business intelligence"}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Modern Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-8 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Credit Score Analysis
                </h1>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl">
                Advanced AI-driven credit assessment using real-time business metrics and predictive analytics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <BusinessSwitcher 
                selectedBusinessId={selectedBusinessId}
                onBusinessChange={handleBusinessChange}
              />
              <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Live Analysis</span>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Credit Score Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1">
              <div className="bg-white rounded-3xl p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      creditPEPE score
                    </h2>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-center">
                  {/* Credit Score Legend */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Ranges</h3>
                    <div className="space-y-3">
                      {[
                        { range: '750 - 900', label: 'Excellent', color: 'bg-emerald-500', textColor: 'text-emerald-700' },
                        { range: '600 - 749', label: 'Good / Stable', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
                        { range: '500 - 599', label: 'At Risk', color: 'bg-orange-500', textColor: 'text-orange-700' },
                        { range: '< 500', label: 'Poor / Critical', color: 'bg-red-500', textColor: 'text-red-700' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50/50">
                          <div className={`w-4 h-4 ${item.color} rounded-full shadow-sm`}></div>
                          <span className="text-sm font-medium text-gray-700 flex-1">{item.range}</span>
                          <span className={`text-sm font-semibold ${item.textColor}`}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Enhanced Credit Score Display */}
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                      <div className={`w-40 h-40 rounded-3xl flex items-center justify-center shadow-2xl border-4 ${getCreditScoreColor(creditScore)} transform hover:scale-105 transition-transform duration-300`}>
                        <span className="text-5xl font-bold">{Math.round(creditScore)}</span>
                      </div>
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className={`px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg text-center ${getCreditScoreIndicatorColor(creditScore)}`}>
                          {getCreditCategory(creditScore).label}
                        </div>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-semibold text-gray-700">
                        Range: {getCreditCategory(creditScore).range}
                      </p>
                      <p className="text-sm text-gray-500">
                        Based on AI analysis of business metrics
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Percentage Circle */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="3"
                          strokeDasharray={`${(creditScore / 900) * 100}, 100`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800">{Math.round((creditScore / 900) * 100)}%</span>
                        <span className="text-xs text-gray-500">Completion</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Score Progress</p>
                      <p className="text-xs text-gray-500">Out of 900 maximum</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Enhanced Business Metrics */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Business Intelligence Metrics</CardTitle>
                  <p className="text-gray-600 mt-1">Real-time data driving your credit assessment</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Users className="h-8 w-8" />,
                    title: "Customer Base",
                    value: Math.round(aiFeatures.customer_number),
                    subtitle: "Total unique customers",
                    description: "Higher customer count improves creditworthiness",
                    gradient: "from-blue-500 to-cyan-500",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                    textColor: "text-blue-700"
                  },
                  {
                    icon: <ShoppingCart className="h-8 w-8" />,
                    title: "Order Frequency",
                    value: Math.round(aiFeatures.customer_order),
                    subtitle: "Orders per customer",
                    description: "More orders per customer = better score",
                    gradient: "from-emerald-500 to-green-500",
                    bgColor: "bg-emerald-50",
                    borderColor: "border-emerald-200",
                    textColor: "text-emerald-700"
                  },
                  {
                    icon: <DollarSign className="h-8 w-8" />,
                    title: "Revenue Volume",
                    value: formatCurrency(aiFeatures.amount),
                    subtitle: "Combined order value",
                    description: "Higher revenue = better credit score",
                    gradient: "from-purple-500 to-pink-500",
                    bgColor: "bg-purple-50",
                    borderColor: "border-purple-200",
                    textColor: "text-purple-700"
                  },
                  {
                    icon: <Calendar className="h-8 w-8" />,
                    title: "Recent Activity",
                    value: `${aiFeatures.days_since_last_transaction}`,
                    subtitle: "Days since last transaction",
                    description: "Recent activity = better credit score",
                    gradient: "from-orange-500 to-red-500",
                    bgColor: "bg-orange-50",
                    borderColor: "border-orange-200",
                    textColor: "text-orange-700"
                  },
                  {
                    icon: <Repeat className="h-8 w-8" />,
                    title: "Customer Loyalty",
                    value: `${Math.round(aiFeatures.customer_stickiness * 100)}%`,
                    subtitle: "Repeat customer rate",
                    description: "Higher repeat rate = better score",
                    gradient: "from-pink-500 to-rose-500",
                    bgColor: "bg-pink-50",
                    borderColor: "border-pink-200",
                    textColor: "text-pink-700"
                  },
                  {
                    icon: <BarChart3 className="h-8 w-8" />,
                    title: "Final Assessment",
                    value: Math.round(creditScore),
                    subtitle: "AI-calculated score",
                    description: "Based on all metrics above",
                    gradient: "from-gray-600 to-slate-600",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    textColor: "text-gray-700"
                  }
                ].map((metric, index) => (
                  <div 
                    key={index} 
                    className={`group relative p-6 ${metric.bgColor} rounded-2xl border ${metric.borderColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.gradient} text-white shadow-lg`}>
                        {metric.icon}
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${metric.textColor}`}>
                          {metric.value}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className={`font-semibold ${metric.textColor} text-lg`}>{metric.title}</h4>
                      <p className={`text-sm font-medium ${metric.textColor} opacity-80`}>{metric.subtitle}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{metric.description}</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Calculation Methodology */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">AI Assessment Methodology</CardTitle>
                  <p className="text-gray-600 mt-1">Understanding how your credit score is calculated</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    Primary Factors
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Customer Base Size",
                        description: "Larger customer base indicates market acceptance and business stability",
                        weight: "25%",
                        color: "bg-blue-500"
                      },
                      {
                        title: "Revenue Consistency",
                        description: "Higher and consistent revenue demonstrates financial health",
                        weight: "25%",
                        color: "bg-purple-500"
                      }
                    ].map((factor, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className={`w-12 h-12 ${factor.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                          {factor.weight}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{factor.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{factor.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    Secondary Factors
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Order Frequency",
                        description: "Regular customer orders show sustainable business relationships",
                        weight: "20%",
                        color: "bg-emerald-500"
                      },
                      {
                        title: "Business Activity",
                        description: "Recent transactions indicate active and ongoing operations",
                        weight: "15%",
                        color: "bg-orange-500"
                      },
                      {
                        title: "Customer Retention",
                        description: "High repeat customer rate demonstrates service quality",
                        weight: "15%",
                        color: "bg-pink-500"
                      }
                    ].map((factor, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className={`w-12 h-12 ${factor.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                          {factor.weight}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{factor.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{factor.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">AI Processing</h4>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Our advanced machine learning algorithms analyze these metrics in real-time, comparing your business 
                  performance against industry benchmarks and historical data patterns to generate a comprehensive 
                  credit score that reflects your true creditworthiness.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreditPepe;
