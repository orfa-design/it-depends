'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useV2Data } from '../V2DataContext';
import { GalleryView } from '../V2ClientApp';
import V2AppShell from '../V2AppShell';

export default function V2GalleryPage() {
  const router = useRouter();
  const { steps, copy, getStatus, getStatusString, progress } = useV2Data();

  return (
    <V2AppShell>
      <GalleryView 
        steps={steps} 
        copy={copy} 
        getStatus={getStatus} 
        getStatusString={getStatusString}
        onOpenCard={(id) => router.push(`/v2/step/${id}`)} 
        notInterested={progress.notInterested || {}}
      />
    </V2AppShell>
  );
}
