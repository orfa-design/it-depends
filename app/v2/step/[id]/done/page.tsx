'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useV2Data } from '../../../V2DataContext';
import { DonePage } from '../../../V2ClientApp';

interface DonePageProps {
  params: Promise<{ id: string }>;
}

export default function V2StepDonePage({ params }: DonePageProps) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const { steps, copy, progress, nextStep } = useV2Data();

  const step = steps.find(s => s.id === id);

  if (!step) {
    return (
      <div className="analysis" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Step not found</h2>
        <button className="btn btn-ghost" style={{ marginTop: '20px' }} onClick={() => router.push('/v2/map')}>
          Back to map
        </button>
      </div>
    );
  }

  return (
    <div className="app style-calm" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DonePage 
        stepId={id} 
        steps={steps} 
        copy={copy} 
        results={progress.results || {}} 
        onMap={() => router.push(nextStep ? `/v2/step/${nextStep.id}` : '/v2/map')}
        onOpenStep={(otherId) => router.push(`/v2/step/${otherId}`)} 
      />
    </div>
  );
}
