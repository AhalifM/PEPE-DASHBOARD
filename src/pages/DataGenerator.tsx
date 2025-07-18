import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { BusinessDataPopulator } from '@/components/dev/BusinessDataPopulator';

export default function DataGenerator() {
  return (
    <PageLayout title="Data Generator">
      <BusinessDataPopulator />
    </PageLayout>
  );
}
