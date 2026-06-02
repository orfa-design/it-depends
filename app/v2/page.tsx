'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useV2Data } from './V2DataContext';

export default function V2RootPage() {
  const router = useRouter();
  const { loading } = useV2Data();

  useEffect(() => {
    if (loading) return;
    // Auth/calibration redirects are handled by V2DataContext.
    // If loading is done and we're still here, the user is good — send them to the map.
    router.push('/v2/map');
  }, [loading, router]);

  return (
    <div className="analysis">
      <h1>
        loading<span className="cursor">_</span>
      </h1>
    </div>
  );
}
