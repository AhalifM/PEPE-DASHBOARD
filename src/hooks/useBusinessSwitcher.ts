import { useState, useEffect } from 'react';
import FirebaseService, { BusinessProfile } from '@/lib/firebaseService';

export const useBusinessSwitcher = (initialBusinessId?: string) => {
  const [availableBusinesses, setAvailableBusinesses] = useState<BusinessProfile[]>([]);
  const [currentBusinessId, setCurrentBusinessId] = useState<string>(initialBusinessId || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setLoading(true);
        const businesses = await FirebaseService.getAllBusinesses();
        setAvailableBusinesses(businesses);
        
        // Set the first business as default if no current business is set
        if (businesses.length > 0 && !currentBusinessId) {
          setCurrentBusinessId(businesses[0].id || '');
        }
      } catch (err) {
        console.error('Error loading businesses:', err);
        setError(err instanceof Error ? err.message : 'Failed to load businesses');
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, [currentBusinessId]);

  const switchBusiness = (businessId: string) => {
    setCurrentBusinessId(businessId);
    // This will trigger a re-render and the parent component can respond to the change
  };

  const getCurrentBusiness = () => {
    return availableBusinesses.find(b => b.id === currentBusinessId) || null;
  };

  return {
    availableBusinesses,
    currentBusinessId,
    getCurrentBusiness,
    switchBusiness,
    loading,
    error
  };
};
