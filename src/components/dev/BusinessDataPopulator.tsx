import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { populateBusinessesToFirebase, exportBusinessDataForAI } from '@/utils/businessDataGenerator';

export const BusinessDataPopulator: React.FC = () => {
  const [isPopulating, setIsPopulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [businessIds, setBusinessIds] = useState<string[]>([]);

  const handlePopulateData = async () => {
    setIsPopulating(true);
    setProgress(0);
    setError(null);
    setCompleted(false);
    setStatus('Initializing data generation...');

    try {
      const totalBusinesses = 10;
      let currentProgress = 0;

      // Simulate progress updates with more granular steps
      const updateProgress = (message: string, progressValue: number) => {
        setStatus(message);
        setProgress(progressValue);
      };

      updateProgress('🎲 Generating business data...', 10);
      
      // Add a small delay to show the progress
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateProgress('📊 Creating business profiles...', 20);
      
      // Start the actual data generation with progress tracking
      const progressInterval = setInterval(() => {
        currentProgress += 2;
        if (currentProgress < 85) {
          setProgress(currentProgress);
          if (currentProgress < 40) {
            setStatus('📋 Creating business profiles...');
          } else if (currentProgress < 60) {
            setStatus('🛒 Adding orders and invoices...');
          } else if (currentProgress < 80) {
            setStatus('💰 Generating transactions...');
          } else {
            setStatus('📄 Creating credit applications...');
          }
        }
      }, 200);

      // Generate the actual data
      const ids = await populateBusinessesToFirebase(totalBusinesses);
      
      clearInterval(progressInterval);
      setProgress(100);
      setBusinessIds(ids);
      setStatus(`🎉 Successfully created ${ids.length} businesses with complete data!`);
      setCompleted(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to populate data');
      setStatus('❌ Error occurred during data population');
    } finally {
      setIsPopulating(false);
    }
  };

  const handleExportAIData = async () => {
    try {
      setStatus('Exporting AI training data...');
      const aiData = await exportBusinessDataForAI();
      
      // Convert to JSON and download
      const dataStr = JSON.stringify(aiData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'business_ai_training_data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setStatus('AI training data exported successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export AI data');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Business Data Generator</h1>
        <p className="text-muted-foreground">
          Generate comprehensive business data for AI credit scoring and system testing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Population Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Firebase Data Population
            </CardTitle>
            <CardDescription>
              Generate 10 businesses with complete transaction histories, orders, invoices, and credit applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Generated Data Includes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Business profiles with credit scores</li>
                <li>• 5-40 transactions per business</li>
                <li>• Customer orders and invoices</li>
                <li>• Financial transaction records</li>
                <li>• Credit applications</li>
                <li>• AI-compatible feature calculations</li>
              </ul>
            </div>

            {isPopulating && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">{status}</p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {completed && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  {status}
                </div>
                <div className="text-sm text-muted-foreground">
                  Created {businessIds.length} businesses in Firebase
                </div>
              </div>
            )}

            <Button
              onClick={handlePopulateData}
              disabled={isPopulating}
              className="w-full"
            >
              {isPopulating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Data...
                </>
              ) : (
                'Populate Firebase Database'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* AI Data Export Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              AI Training Data Export
            </CardTitle>
            <CardDescription>
              Export business data in format compatible with PepeAI credit scoring model
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">AI Model Features:</h4>
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="outline">customer_number</Badge>
                <Badge variant="outline">customer_order</Badge>
                <Badge variant="outline">amount</Badge>
                <Badge variant="outline">days_since_last</Badge>
                <Badge variant="outline">customer_stickiness</Badge>
                <Badge variant="outline">credit_score</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Credit Categories:</h4>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-green-100 text-green-800">excellent (720+)</Badge>
                <Badge className="bg-blue-100 text-blue-800">good (660-719)</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">at_risk (580-659)</Badge>
                <Badge className="bg-red-100 text-red-800">poor (&lt;580)</Badge>
              </div>
            </div>

            <Button
              onClick={handleExportAIData}
              variant="outline"
              className="w-full"
              disabled={isPopulating}
            >
              Export AI Training Data (JSON)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Data Generation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Business Distribution:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Technology companies</li>
                <li>• Healthcare services</li>
                <li>• Financial services</li>
                <li>• Retail businesses</li>
                <li>• Manufacturing</li>
                <li>• Construction</li>
                <li>• Hospitality</li>
                <li>• And more...</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">AI Model Compatible:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Hard filtering rules applied</li>
                <li>• Minimum 5 transactions per business</li>
                <li>• Realistic payment behaviors</li>
                <li>• Customer stickiness calculations</li>
                <li>• Credit score predictions</li>
                <li>• XGBoost ready features</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessDataPopulator;
