import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import FirebaseService, { 
  BusinessProfile, 
  Order, 
  Invoice, 
  Transaction, 
  CreditApplication 
} from '@/lib/firebaseService';

// Custom hook for business profile
export const useBusinessProfile = (businessId?: string) => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await FirebaseService.getBusinessProfile(businessId);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch business profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [businessId]);

  return { profile, loading, error, refetch: () => {
    if (businessId) {
      FirebaseService.getBusinessProfile(businessId).then(setProfile);
    }
  }};
};

// Custom hook for orders
export const useOrders = (businessId?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await FirebaseService.getOrders(businessId);
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [businessId]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await FirebaseService.createOrder(orderData);
      const newOrder = { ...orderData, id } as Order;
      setOrders(prev => [newOrder, ...prev]);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    }
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      await FirebaseService.updateOrder(orderId, updates);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
      throw err;
    }
  };

  return { orders, loading, error, createOrder, updateOrder };
};

// Custom hook for invoices
export const useInvoices = (businessId?: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const data = await FirebaseService.getInvoices(businessId);
        setInvoices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [businessId]);

  const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await FirebaseService.createInvoice(invoiceData);
      const newInvoice = { ...invoiceData, id } as Invoice;
      setInvoices(prev => [newInvoice, ...prev]);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
      throw err;
    }
  };

  const updateInvoice = async (invoiceId: string, updates: Partial<Invoice>) => {
    try {
      await FirebaseService.updateInvoice(invoiceId, updates);
      setInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId ? { ...invoice, ...updates } : invoice
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update invoice');
      throw err;
    }
  };

  return { invoices, loading, error, createInvoice, updateInvoice };
};

// Custom hook for transactions
export const useTransactions = (businessId?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await FirebaseService.getTransactions(businessId);
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [businessId]);

  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await FirebaseService.createTransaction(transactionData);
      const newTransaction = { ...transactionData, id } as Transaction;
      setTransactions(prev => [newTransaction, ...prev]);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
      throw err;
    }
  };

  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    try {
      await FirebaseService.updateTransaction(transactionId, updates);
      setTransactions(prev => prev.map(transaction => 
        transaction.id === transactionId ? { ...transaction, ...updates } : transaction
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
      throw err;
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      await FirebaseService.deleteTransaction(transactionId);
      setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
      throw err;
    }
  };

  return { transactions, loading, error, createTransaction, updateTransaction, deleteTransaction };
};

// Custom hook for credit applications
export const useCreditApplications = (businessId?: string) => {
  const [applications, setApplications] = useState<CreditApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await FirebaseService.getCreditApplications(businessId);
        setApplications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch credit applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [businessId]);

  const createApplication = async (applicationData: Omit<CreditApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await FirebaseService.createCreditApplication(applicationData);
      const newApplication = { ...applicationData, id } as CreditApplication;
      setApplications(prev => [newApplication, ...prev]);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create credit application');
      throw err;
    }
  };

  return { applications, loading, error, createApplication };
};

// Custom hook for business analytics
export const useBusinessAnalytics = (businessId?: string) => {
  const [analytics, setAnalytics] = useState<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    pendingInvoicesCount: number;
    pendingAmount: number;
    ordersThisMonth: number;
    totalOrders: number;
    totalInvoices: number;
    totalTransactions: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await FirebaseService.getBusinessAnalytics(businessId);
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [businessId]);

  return { analytics, loading, error, refetch: () => {
    if (businessId) {
      FirebaseService.getBusinessAnalytics(businessId).then(setAnalytics);
    }
  }};
};

// Custom hook for authentication state
export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);
  
  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    businessId: user?.uid // Using user's UID as business ID for simplicity
  };
};
