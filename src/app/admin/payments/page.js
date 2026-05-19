'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/finance.module.css';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const router = useRouter();

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/admin/payments');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch payment records');
      }
      const data = await res.json();
      setPayments(data.payments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAction = async (paymentId, action) => {
    setProcessingId(paymentId);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, action })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update payment status');

      alert(`Payment successfully ${action === 'approve' ? 'approved' : 'declined'}!`);
      fetchPayments(); // Reload list
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#fff',
        fontFamily: "'Inter', sans-serif"
      }}>
        <h2>Loading payment verification panel...</h2>
      </div>
    );
  }

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const pastPayments = payments.filter(p => p.status !== 'pending');

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      padding: '40px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          marginBottom: '40px'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>Crypto Payment Verification</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: '4px 0 0 0', fontSize: '14px' }}>Review and approve submitted partner rotator payments.</p>
          </div>
          <button onClick={() => router.push('/admin')} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '10px 20px',
            borderRadius: '12px',
            color: '#fff',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '14px'
          }}>Back to Overview</button>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 75, 75, 0.1)', border: '1px solid rgba(255, 75, 75, 0.2)', color: '#ff4b4b', padding: '16px', borderRadius: '16px', marginBottom: '32px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Section 1: Pending Approvals */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', background: '#d4af37', borderRadius: '50%' }}></span>
            Pending Approvals ({pendingPayments.length})
          </h2>

          <div style={{
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '24px',
            overflowX: 'auto'
          }}>
            {pendingPayments.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                    <th style={{ padding: '12px 16px' }}>Date</th>
                    <th style={{ padding: '12px 16px' }}>Partner</th>
                    <th style={{ padding: '12px 16px' }}>Coin</th>
                    <th style={{ padding: '12px 16px' }}>Runs</th>
                    <th style={{ padding: '12px 16px' }}>TXID / Hash</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '16px' }}>{new Date(p.created_at).toLocaleString()}</td>
                      <td style={{ padding: '16px' }}>
                        <strong style={{ display: 'block' }}>{p.partner?.full_name || 'Unknown'}</strong>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Code: {p.partner?.affiliate_code}</span>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>{p.coin_type}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{p.runs_requested} Runs</span> (${p.runs_requested * 100})
                      </td>
                      <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all', maxWidth: '240px' }}>
                        <a href={`https://blockchair.com/search?q=${p.txid}`} target="_blank" rel="noreferrer" style={{ color: '#2d8cf0', textDecoration: 'none' }}>
                          {p.txid} ↗
                        </a>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            disabled={processingId === p.id}
                            onClick={() => handleAction(p.id, 'approve')}
                            style={{
                              background: '#00ff88',
                              border: 'none',
                              color: '#000',
                              fontWeight: '800',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              cursor: 'pointer',
                              fontSize: '13px'
                            }}
                          >
                            Approve
                          </button>
                          <button
                            disabled={processingId === p.id}
                            onClick={() => handleAction(p.id, 'decline')}
                            style={{
                              background: 'rgba(255,75,75,0.1)',
                              border: '1px solid rgba(255,75,75,0.2)',
                              color: '#ff4b4b',
                              fontWeight: '700',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              cursor: 'pointer',
                              fontSize: '13px'
                            }}
                          >
                            Decline
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ margin: 0, padding: '24px 0', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                No pending crypto payments.
              </p>
            )}
          </div>
        </section>

        {/* Section 2: Archive History */}
        <section>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></span>
            Processed Submissions Archive ({pastPayments.length})
          </h2>

          <div style={{
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '24px',
            overflowX: 'auto'
          }}>
            {pastPayments.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                    <th style={{ padding: '12px 16px' }}>Date</th>
                    <th style={{ padding: '12px 16px' }}>Partner</th>
                    <th style={{ padding: '12px 16px' }}>Coin</th>
                    <th style={{ padding: '12px 16px' }}>Runs</th>
                    <th style={{ padding: '12px 16px' }}>TXID / Hash</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastPayments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', opacity: 0.7 }}>
                      <td style={{ padding: '12px 16px' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <strong>{p.partner?.full_name || 'Unknown'}</strong>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{p.coin_type}</td>
                      <td style={{ padding: '12px 16px' }}>{p.runs_requested} Runs</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all' }}>{p.txid}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          background: p.status === 'approved' ? 'rgba(0,255,136,0.1)' : 'rgba(255,75,75,0.1)',
                          color: p.status === 'approved' ? '#00ff88' : '#ff4b4b'
                        }}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ margin: 0, padding: '24px 0', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                No processed entries in the archive history.
              </p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
