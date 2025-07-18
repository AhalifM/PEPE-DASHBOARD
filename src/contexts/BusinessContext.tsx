import React, { createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { useAuth, useBusinessProfile, useBusinessAnalytics } from '@/hooks/useFirebase';
import { BusinessProfile } from '@/lib/firebaseService';
import { SHOWCASE_CONFIG } from '@/lib/showcaseConfig';

interface BusinessAnalytics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingInvoicesCount: number;
  pendingAmount: number;
  ordersThisMonth: number;
  totalOrders: number;
  totalInvoices: number;
  totalTransactions: number;
}

interface BusinessContextType {
  user: User | null | undefined;
  businessId?: string;
  isAuthenticated: boolean;
  profile: BusinessProfile | null;
  analytics: BusinessAnalytics | null;
  loading: boolean;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export { BusinessContext };

interface BusinessProviderProps {
  children: ReactNode;
}

export const BusinessProvider: React.FC<BusinessProviderProps> = ({ children }) => {
  // For showcase mode, use fixed business ID
  const showcaseBusinessId = SHOWCASE_CONFIG.DEMO_MODE ? SHOWCASE_CONFIG.BUSINESS_ID : undefined;
  
  const { user, isAuthenticated, businessId: authBusinessId, loading: authLoading } = useAuth();
  
  // Use showcase business ID if in demo mode, otherwise use authenticated business ID
  const effectiveBusinessId = showcaseBusinessId || authBusinessId;
  
  const { profile, loading: profileLoading } = useBusinessProfile(effectiveBusinessId);
  const { analytics, loading: analyticsLoading } = useBusinessAnalytics(effectiveBusinessId);

  const loading = authLoading || profileLoading || analyticsLoading;

  const value: BusinessContextType = {
    user,
    businessId: effectiveBusinessId,
    isAuthenticated: SHOWCASE_CONFIG.DEMO_MODE ? true : isAuthenticated, // Always authenticated in demo mode
    profile,
    analytics,
    loading
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};
