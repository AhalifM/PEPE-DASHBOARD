import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusinessContext } from '@/hooks/useBusinessContext';
import { populateSampleData } from '@/lib/sampleData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Loader2 } from 'lucide-react';

const DatabaseInitializer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useBusinessContext();

  const handlePopulateData = async () => {
    if (!businessId) {
      setError('No business ID found. Please ensure you are authenticated.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await populateSampleData(businessId);
      setMessage('Sample data has been successfully populated to Firebase!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to populate sample data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Database Setup</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Initialize your Firebase database with sample business data for testing.
        </p>
        
        {businessId && (
          <div className="text-xs text-gray-500">
            Business ID: {businessId}
          </div>
        )}

        <Button 
          onClick={handlePopulateData}
          disabled={loading || !businessId}
          className="w-full bg-[#e03b6d] hover:bg-[#c53359]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Populating Data...
            </>
          ) : (
            'Populate Sample Data'
          )}
        </Button>

        {message && (
          <Alert>
            <AlertDescription className="text-green-600">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500">
          <p>This will create:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Business profile</li>
            <li>5 sample orders</li>
            <li>4 sample invoices</li>
            <li>15 sample transactions</li>
            <li>2 credit applications</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseInitializer;
