'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/finance.module.css'; // Reuse core styles for consistency

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className={styles.modalContent} style={{ position: 'relative', padding: '60px' }}>
        <h1 className={styles.modalTitle}>Admin Access</h1>
        <p className={styles.modalSub}>Global Commander Gateway</p>
        
        <form onSubmit={handleLogin} className={styles.modalForm}>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            required 
            className={styles.modalInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          {error && <p style={{ color: '#ff4444', fontSize: '14px', marginTop: '-8px' }}>{error}</p>}
          <button 
            type="submit" 
            className={styles.primaryCta}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Authenticate →'}
          </button>
        </form>
      </div>
    </main>
  );
}
