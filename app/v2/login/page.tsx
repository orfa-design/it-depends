'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorLog, setErrorLog] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = username.trim();
    if (!cleanName) return;

    try {
      setLoading(true);
      setErrorLog(null);
      localStorage.setItem('id_username', cleanName);
      router.push('/v2');
    } catch (err: any) {
      console.error('Login submit error:', err);
      setErrorLog(`Login/Storage Error: ${err.message || err}`);
      setLoading(false);
    }
  };

  return (
    <div className="intro fade-in" style={{ height: '100vh', justifyContent: 'center' }}>
      <div className="intro-wm wordmark">
        <span className="dot">·</span>
        <span className="it">It Depends</span>
      </div>
      
      <div className="intro-inner" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="eyebrow" style={{ marginBottom: '20px' }}>Вхід у систему</div>
        <h1 style={{ fontSize: '32px', marginBottom: '24px', letterSpacing: '-0.02em' }}>Як тебе звати?</h1>
        
        <form onSubmit={handleLogin} style={{ width: '100%', textAlign: 'left' }}>
          <label className="field-label" htmlFor="username">ТВОЄ ІМ'Я</label>
          <input
            id="username"
            type="text"
            className="field-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введіть ім'я..."
            required
            autoComplete="off"
            style={{ marginBottom: '24px', width: '100%' }}
          />

          {errorLog && (
            <div style={{ padding: '12px', background: '#331111', color: '#ffaaaa', border: '1px solid #552222', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
              {errorLog}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={loading || !username.trim()}
          >
            {loading ? 'Вхід...' : 'Увійти →'}
          </button>
        </form>
      </div>
    </div>
  );
}
