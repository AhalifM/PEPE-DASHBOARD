import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, ChevronDown, Zap } from 'lucide-react';
import { useBusinessSwitcher } from '@/hooks/useBusinessSwitcher';

interface BusinessSwitcherProps {
  selectedBusinessId: string;
  onBusinessChange: (businessId: string) => void;
  className?: string;
}

export const BusinessSwitcher: React.FC<BusinessSwitcherProps> = ({
  selectedBusinessId,
  onBusinessChange,
  className = ""
}) => {
  const { availableBusinesses, loading } = useBusinessSwitcher();

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <Skeleton className="h-9 w-[280px]" />
      </div>
    );
  }

  if (availableBusinesses.length === 0) {
    return (
      <div className={`flex items-center space-x-2 p-2 bg-gray-50 rounded-lg ${className}`}>
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">No businesses found</span>
      </div>
    );
  }

  const currentBusiness = availableBusinesses.find(b => b.id === selectedBusinessId);

  const getCreditBadgeColor = (score?: number) => {
    if (!score) return "secondary";
    if (score >= 720) return "default"; // Green
    if (score >= 660) return "secondary"; // Blue  
    if (score >= 580) return "destructive"; // Orange/Yellow
    return "destructive"; // Red
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1 text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span className="text-sm font-medium">Business:</span>
      </div>
      <Select value={selectedBusinessId} onValueChange={onBusinessChange}>
        <SelectTrigger className="w-[320px] bg-white border-gray-200 hover:border-gray-300 transition-colors">
          <SelectValue>
            {currentBusiness ? (
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {currentBusiness.businessName}
                </span>
                {currentBusiness.industry && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {currentBusiness.industry}
                  </Badge>
                )}
                {currentBusiness.creditScore && (
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    <Badge variant={getCreditBadgeColor(currentBusiness.creditScore)} className="text-xs">
                      {currentBusiness.creditScore}
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-gray-500">Select a business...</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="w-[320px]">
          {availableBusinesses.map((business) => (
            <SelectItem 
              key={business.id} 
              value={business.id || ''}
              className="cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{business.businessName}</span>
                    {business.creditScore && (
                      <div className="flex items-center space-x-1">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        <Badge 
                          variant={getCreditBadgeColor(business.creditScore)}
                          className="text-xs"
                        >
                          {business.creditScore}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                      {business.industry}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ID: {business.id}
                    </span>
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {availableBusinesses.length > 1 && (
        <Badge variant="secondary" className="text-xs">
          {availableBusinesses.length} businesses
        </Badge>
      )}
    </div>
  );
};

export default BusinessSwitcher;
