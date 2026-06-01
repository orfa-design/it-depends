'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useV2Data } from './V2DataContext';

export default function V2RootPage() {
  const router = useRouter();
  const { username, loading } = useV2Data();

  useEffect(() => {
    if (loading) return;

    const storedUser = localStorage.getItem('id_username');
    if (!storedUser) {
      router.push('/v2/login');
      return;
    }

    const calibrated = localStorage.getItem('id_calibrated');
    if (!calibrated) {
      router.push('/v2/calibrate');
      return;
    }

    // Default entry page is the recommended Map view
    router.push('/v2/map');
  }, [loading, router]);

  return (
    <div className="analysis" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '32px' }}>
        завантажую<span className="cursor">_</span>
      </h1>
    </div>
  );
}
