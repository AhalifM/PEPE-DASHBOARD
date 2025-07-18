import { useContext } from 'react';
import { BusinessContext } from '@/contexts/BusinessContext';
import { SHOWCASE_CONFIG } from '@/lib/showcaseConfig';

export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusinessContext must be used within a BusinessProvider');
  }
  
  return {
    ...context,
    // Add showcase configuration
    showcaseConfig: SHOWCASE_CONFIG,
    isDemoMode: SHOWCASE_CONFIG.DEMO_MODE,
    showcaseBusinessName: SHOWCASE_CONFIG.BUSINESS_NAME
  };
};
