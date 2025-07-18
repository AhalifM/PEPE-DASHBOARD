import { useState, useEffect } from 'react';
import { SHOWCASE_CONFIG } from '@/lib/showcaseConfig';
import FirebaseService, { 
  BusinessProfile, 
  Order, 
  Invoice, 
  Transaction, 
  CreditApplication 
} from '@/lib/firebaseService';

// Hook for loading all showcase business data
export const useShowcaseData = (selectedBusinessId?: string) => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [creditApplications, setCreditApplications] = useState<CreditApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actualBusinessId, setActualBusinessId] = useState<string>(selectedBusinessId || SHOWCASE_CONFIG.BUSINESS_ID);
  const [actualBusinessName, setActualBusinessName] = useState<string>(SHOWCASE_CONFIG.BUSINESS_NAME);

  useEffect(() => {
    const loadShowcaseData = async () => {
      if (!SHOWCASE_CONFIG.DEMO_MODE) return;

      try {
        setLoading(true);
        const businessId = selectedBusinessId || SHOWCASE_CONFIG.BUSINESS_ID;

        console.log(`🎯 Loading showcase data for: ${SHOWCASE_CONFIG.BUSINESS_NAME}`);
        console.log(`🔍 Looking for business ID: ${businessId}`);

        // First, try to get any businesses to see what exists
        const allBusinesses = await FirebaseService.getAllBusinesses();
        console.log(`📊 Found ${allBusinesses.length} businesses in database:`, allBusinesses.map(b => ({ id: b.id, name: b.businessName })));

        // If BIZ00009 doesn't exist, use the first available business
        let targetBusinessId: string = businessId;
        if (allBusinesses.length > 0) {
          const targetBusiness = allBusinesses.find(b => b.id === businessId);
          if (!targetBusiness) {
            console.log(`⚠️ Business ${businessId} not found, using first available business`);
            targetBusinessId = allBusinesses[0].id || businessId;
            console.log(`🔄 Using business ID: ${targetBusinessId} (${allBusinesses[0].businessName})`);
          }
        }

        // Load all data in parallel
        const [
          profileData,
          ordersData,
          invoicesData,
          transactionsData,
          creditData
        ] = await Promise.all([
          FirebaseService.getBusinessProfile(targetBusinessId),
          FirebaseService.getOrders(targetBusinessId),
          FirebaseService.getInvoices(targetBusinessId),
          FirebaseService.getTransactions(targetBusinessId),
          FirebaseService.getCreditApplications(targetBusinessId)
        ]);

        setProfile(profileData);
        setOrders(ordersData);
        setInvoices(invoicesData);
        setTransactions(transactionsData);
        setCreditApplications(creditData);
        setActualBusinessId(targetBusinessId);
        setActualBusinessName(profileData?.businessName || SHOWCASE_CONFIG.BUSINESS_NAME);

        console.log(`✅ Loaded showcase data:`, {
          profile: !!profileData,
          orders: ordersData.length,
          invoices: invoicesData.length,
          transactions: transactionsData.length,
          creditApplications: creditData.length,
          actualBusinessId: targetBusinessId,
          actualBusinessName: profileData?.businessName
        });

      } catch (err) {
        console.error('❌ Error loading showcase data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load showcase data');
      } finally {
        setLoading(false);
      }
    };

    loadShowcaseData();
  }, [selectedBusinessId]);

  // Calculate analytics from loaded data
  const analytics = {
    totalRevenue: transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    
    totalExpenses: transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    
    netProfit: transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) - 
      transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    
    pendingInvoicesCount: invoices.filter(i => i.status === 'sent' || i.status === 'overdue').length,
    
    pendingAmount: invoices
      .filter(i => i.status === 'sent' || i.status === 'overdue')
      .reduce((sum, i) => sum + i.total, 0),
    
    ordersThisMonth: orders.filter(order => {
      const orderDate = new Date(order.orderDate.toDate());
      const now = new Date();
      return orderDate.getMonth() === now.getMonth() && 
             orderDate.getFullYear() === now.getFullYear();
    }).length,
    
    totalOrders: orders.length,
    totalInvoices: invoices.length,
    totalTransactions: transactions.length
  };

  // AI Features calculation for credit scoring
  const aiFeatures = {
    customer_number: new Set(orders.map(o => o.customerEmail)).size,
    customer_order: orders.length / Math.max(new Set(orders.map(o => o.customerEmail)).size, 1),
    amount: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    days_since_last_transaction: transactions.length > 0 
      ? Math.floor((Date.now() - Math.max(...transactions.map(t => t.date.toDate().getTime()))) / (1000 * 60 * 60 * 24))
      : 365,
    customer_stickiness: orders.length > 0 
      ? 1 - (new Set(orders.map(o => o.customerEmail)).size / orders.length)
      : 0
  };

  return {
    // Data
    profile,
    orders,
    invoices,
    transactions,
    creditApplications,
    
    // Analytics
    analytics,
    aiFeatures,
    
    // State
    loading,
    error,
    
    // Config
    businessId: actualBusinessId,
    businessName: actualBusinessName,
    isDemoMode: SHOWCASE_CONFIG.DEMO_MODE
  };
};

// Hook for credit scoring specific to showcase business
export const useShowcaseCreditScore = (selectedBusinessId?: string) => {
  const { aiFeatures, profile, loading } = useShowcaseData(selectedBusinessId);
  const [creditScore, setCreditScore] = useState<number>(0);
  const [creditCategory, setCreditCategory] = useState<string>('');

  useEffect(() => {
    if (!loading && aiFeatures) {
      // Calculate credit score using PepeAI formula
      const calculateCreditScore = () => {
        const base_score = 300;
        
        // Customer Number: More customers = better score (up to +150 points)
        const customer_score = Math.min(Math.sqrt(aiFeatures.customer_number) * 20, 150);
        
        // Customer Order: More orders per customer = better score (up to +100 points)
        const order_score = Math.min(aiFeatures.customer_order * 10, 100);
        
        // Amount: Higher total amount = better score (logarithmic scale, up to +200 points)
        const amount_score = Math.min(Math.log(Math.max(aiFeatures.amount, 1)) * 15, 200);
        
        // Last Transaction: Recent transactions = better score
        let recency_score: number;
        if (aiFeatures.days_since_last_transaction <= 30) {
          recency_score = 100;
        } else if (aiFeatures.days_since_last_transaction <= 90) {
          recency_score = 100 - (aiFeatures.days_since_last_transaction - 30) * 1.5;
        } else {
          recency_score = Math.max(0, 100 - (aiFeatures.days_since_last_transaction - 30) * 2);
        }
        
        // Customer Stickiness: Higher repeat rate = better score (up to +100 points)
        const stickiness_score = aiFeatures.customer_stickiness * 100;
        
        // Calculate final score
        const final_score = base_score + customer_score + order_score + amount_score + recency_score + stickiness_score;
        
        return Math.max(300, Math.min(900, final_score));
      };

      const score = calculateCreditScore();
      setCreditScore(Math.round(score));

      // Categorize credit score
      if (score >= 720) setCreditCategory('excellent');
      else if (score >= 660) setCreditCategory('good');
      else if (score >= 580) setCreditCategory('at_risk');
      else setCreditCategory('poor');
    }
  }, [aiFeatures, loading]);

  return {
    creditScore: profile?.creditScore || creditScore,
    creditCategory,
    aiFeatures,
    loading
  };
};
