'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useV2Data } from '../V2DataContext';
import { ActivePage } from '../V2ClientApp';
import V2AppShell from '../V2AppShell';

export default function V2ProgressPage() {
  const router = useRouter();
  const { steps, copy, getStatus } = useV2Data();

  return (
    <V2AppShell>
      <ActivePage 
        steps={steps} 
        copy={copy}
        getStatus={getStatus} 
        onOpenCard={(id) => router.push(`/v2/step/${id}`)} 
        onGoGallery={() => router.push('/v2/gallery')} 
      />
    </V2AppShell>
  );
}
