'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const WALLETS = {
  BTC: {
    name: 'Bitcoin (BTC)',
    address: 'bc1qgnpplgvp33zf77dnthxl5xv5cxxsk5arak540l',
    network: 'Bitcoin Network'
  },
  BNB: {
    name: 'Binance Coin (BNB)',
    address: '0x4b5C494a822E9B1876C8B879fE65b1F0Aba9c4BC',
    network: 'BSC (BEP-20)'
  },
  USDT: {
    name: 'Tether (USDT)',
    address: '0x4b5C494a822E9B1876C8B879fE65b1F0Aba9c4BC',
    network: 'BEP-20 (Binance Smart Chain)'
  },
  XLM: {
    name: 'Stellar (XLM)',
    address: 'GCPU6LGA3K3RPDSPI25OGMRT32SYSL562LOIC2KWNAXOPLFG3OQAS4KW',
    network: 'Stellar Network (No memo required)'
  }
};

export default function PartnerDashboard() {
  const [partner, setPartner] = useState(null);
  const [activeFunnels, setActiveFunnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  
  // Payment Form State
  const [coinType, setCoinType] = useState('BTC');
  const [runsRequested, setRunsRequested] = useState(1);
  const [txid, setTxid] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/partner/me');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/partner/login');
          return;
        }
        throw new Error('Failed to load profile');
      }
      const data = await res.json();
      setPartner(data.partner);
      setActiveFunnels(data.activeFunnels || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/partner/auth', { method: 'DELETE' });
    router.push('/partner/login');
  };

  const handleFunnelChange = async (funnelId) => {
    try {
      const res = await fetch('/api/partner/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funnelId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update funnel selection');
      
      // Update local state
      setPartner(prev => ({ ...prev, unlocked_funnels: funnelId }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setSubmittingPayment(true);
    setPaymentSuccess('');
    setPaymentError('');

    try {
      const res = await fetch('/api/partner/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coinType,
          runsRequested: parseInt(runsRequested),
          txid
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setPaymentSuccess('Payment details submitted successfully! Pending admin approval.');
      setTxid('');
      fetchProfile(); // Refresh profile history
    } catch (err) {
      setPaymentError(err.message);
    } finally {
      setSubmittingPayment(false);
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
        <h2>Loading partner workspace...</h2>
      </div>
    );
  }

  const referralUrl = `https://www.welcometoaurum.com/?ref=${partner?.affiliate_code}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=00ff88&bgcolor=1a1a1a&data=${encodeURIComponent(referralUrl)}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top right, #151515 0%, #050505 100%)',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Navigation Bar */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '32px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          marginBottom: '40px',
          position: 'relative',
          zIndex: 50
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>Partner Dashboard</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: '4px 0 0 0', fontSize: '14px' }}>Welcome back, <strong style={{ color: '#00ff88' }}>{partner?.full_name}</strong></p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a href="https://aurum-education-portal.vercel.app/syllabus" target="_blank" rel="noopener noreferrer" style={{
              background: 'rgba(0, 255, 136, 0.05)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              padding: '10px 20px',
              borderRadius: '12px',
              color: '#00ff88',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.2s'
            }}>Course Syllabus 📚</a>
            <button onClick={handleLogout} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '10px 20px',
              borderRadius: '12px',
              color: '#ff4b4b',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}>Log Out</button>
          </div>
        </header>

        {/* Stats Grid */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Total Opt-in Leads</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#00ff88' }}>{partner?.totalLeads}</div>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Rotator Runs Left</div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '900', 
              color: (partner?.rotator_runs || 0) > 0 ? '#00ff88' : '#ff4b4b' 
            }}>{partner?.rotator_runs || 0}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Active Funnel Slug</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#2d8cf0', textTransform: 'uppercase' }}>{partner?.unlocked_funnels || 'None selected'}</div>
          </div>
        </section>

        {/* Dashboard Workspace */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '40px'
        }}>
          
          {/* LEFT COLUMN: Links, QR Code, Funnels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Syllabus Access Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.02) 0%, rgba(45, 140, 240, 0.02) 100%)',
              border: '1px solid rgba(0, 255, 136, 0.12)',
              padding: '32px',
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, transparent 70%)',
                zIndex: 0
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Education Portal</span>
                  <span style={{ fontSize: '10px', background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Active</span>
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '0 0 20px 0', lineHeight: '1.6' }}>
                  Access the official course curriculum covering automated trading algorithms, staking models, and ecosystem navigation.
                </p>
                <a
                  href="https://aurum-education-portal.vercel.app/syllabus"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#00ff88',
                    border: 'none',
                    color: '#000',
                    fontWeight: '800',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textDecoration: 'none',
                    display: 'inline-block',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0, 255, 136, 0.15)',
                    transition: 'all 0.2s'
                  }}
                >
                  Enter Syllabus Portal 📚
                </a>
              </div>
            </div>

            {/* Referral Link Card */}
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.04)',
              padding: '32px',
              borderRadius: '24px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800' }}>Your Referral Link</h3>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input
                  readOnly
                  value={referralUrl}
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralUrl);
                    alert('Referral link copied to clipboard!');
                  }}
                  style={{
                    background: '#00ff88',
                    border: 'none',
                    color: '#000',
                    fontWeight: '800',
                    borderRadius: '12px',
                    padding: '0 20px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Copy
                </button>
              </div>

              {/* Dynamic QR Code */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.1)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.03)'
              }}>
                <img
                  src={qrCodeUrl}
                  alt="My Affiliate QR Code"
                  style={{ width: '180px', height: '180px', borderRadius: '12px', marginBottom: '16px' }}
                />
                <a
                  href={qrCodeUrl}
                  download="my_aurum_qr.png"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#00ff88',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Download QR Code 📥
                </a>
              </div>
            </div>

            {/* Funnel Selector Card */}
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.04)',
              padding: '32px',
              borderRadius: '24px'
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>Active Funnel Variant</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '0 0 24px 0' }}>
                Choose which page layout/angle your traffic will land on:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeFunnels.map(funnel => {
                  const isSelected = partner?.unlocked_funnels === funnel.slug;
                  // Handle vanity routes vs dynamic routes
                  let viewUrl = `/f/${funnel.slug}/${funnel.angle}?ref=${partner?.affiliate_code}`;
                  if (funnel.slug === 'neyro') viewUrl = `/neyro?ref=${partner?.affiliate_code}`;
                  else if (funnel.slug === 'neyro-gateway') viewUrl = `/gateway?ref=${partner?.affiliate_code}`;
                  else if (funnel.slug === 'aurum-pitch') viewUrl = `/pitch?ref=${partner?.affiliate_code}`;
                  else if (funnel.slug === 'aurum-consultative') viewUrl = `/consultative?ref=${partner?.affiliate_code}`;

                  // Descriptions
                  let desc = 'AI-driven wealth acceleration';
                  if (funnel.angle === 'gateway') desc = 'Immediate opt-in gate';
                  else if (funnel.angle === 'consultative') desc = 'Direct video orientation capture';
                  else if (funnel.angle === 'pitch') desc = 'Direct sales pitch opt-in';
                  else if (funnel.angle.includes('pay-it-forward')) desc = 'Special promotional entry';

                  return (
                    <label 
                      key={funnel.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: isSelected ? 'rgba(0, 255, 136, 0.03)' : 'rgba(255,255,255,0.01)',
                        border: isSelected ? '1px solid rgba(0, 255, 136, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="activeFunnel"
                          checked={isSelected}
                          onChange={() => handleFunnelChange(funnel.slug)}
                          style={{ accentColor: '#00ff88', width: '18px', height: '18px' }}
                        />
                        <div>
                          <strong style={{ display: 'block', fontSize: '15px' }}>{funnel.name}</strong>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{desc}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const fullUrl = `${window.location.origin}${viewUrl}`;
                            navigator.clipboard.writeText(fullUrl);
                            setCopiedId(funnel.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          style={{
                            background: copiedId === funnel.id ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255,255,255,0.02)',
                            border: copiedId === funnel.id ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid rgba(255,255,255,0.08)',
                            color: copiedId === funnel.id ? '#00ff88' : 'rgba(255,255,255,0.6)',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            transition: 'all 0.2s',
                            outline: 'none'
                          }}
                        >
                          {copiedId === funnel.id ? 'Copied ✓' : 'Copy Link'}
                        </button>
                        <a href={viewUrl} target="_blank" style={{ color: '#00ff88', fontSize: '12px', textDecoration: 'none', fontWeight: 'bold' }}>View Page ↗</a>
                      </div>
                    </label>
                  );
                })}
                {activeFunnels.length === 0 && (
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                    No active funnels configured.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Crypto Rotator & History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Purchase Form */}
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.04)',
              padding: '32px',
              borderRadius: '24px'
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>Paid Traffic Rotator Pool</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '0 0 24px 0' }}>
                Participate in paid advertising campaigns. Traffic runs cost **$100 per run**. Deposit details below:
              </p>

              {paymentSuccess && (
                <div style={{ background: 'rgba(0, 255, 136, 0.08)', border: '1px solid rgba(0, 255, 136, 0.2)', color: '#00ff88', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', marginBottom: '20px' }}>
                  ✓ {paymentSuccess}
                </div>
              )}

              {paymentError && (
                <div style={{ background: 'rgba(255, 75, 75, 0.08)', border: '1px solid rgba(255, 75, 75, 0.2)', color: '#ff4b4b', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', marginBottom: '20px' }}>
                  ⚠️ {paymentError}
                </div>
              )}

              <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Select Coin Asset</label>
                  <select
                    value={coinType}
                    onChange={(e) => setCoinType(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#151515',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="BNB">Binance Coin (BNB)</option>
                    <option value="USDT">Tether (USDT)</option>
                    <option value="XLM">Stellar (XLM)</option>
                  </select>
                </div>

                {/* Dynamic Payment Details Display */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '20px',
                  borderRadius: '16px'
                }}>
                  <strong style={{ display: 'block', fontSize: '13px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                    Send $100 equivalent in {coinType} to:
                  </strong>
                  <div style={{
                    fontSize: '14px',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.04)',
                    color: '#00ff88',
                    marginBottom: '8px'
                  }}>
                    {WALLETS[coinType].address}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                    Network: <strong>{WALLETS[coinType].network}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Runs Purchased</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={runsRequested}
                      onChange={(e) => setRunsRequested(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#151515',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Total Amount</label>
                    <div style={{
                      background: 'rgba(0,0,0,0.1)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#00ff88',
                      fontSize: '16px',
                      fontWeight: '800'
                    }}>
                      ${runsRequested * 100} USD
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Transaction ID / Hash (TXID)</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter transaction hash for verification"
                    value={txid}
                    onChange={(e) => setTxid(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#151515',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingPayment}
                  style={{
                    background: '#00ff88',
                    color: '#000',
                    fontWeight: '800',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 255, 136, 0.2)',
                    transition: 'all 0.2s'
                  }}
                >
                  {submittingPayment ? 'Submitting Details...' : 'Submit Payment Proof'}
                </button>
              </form>
            </div>

            {/* Submission Log */}
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.04)',
              padding: '32px',
              borderRadius: '24px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800' }}>Recent Payment Submissions</h3>
              
              {partner?.payments && partner.payments.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                        <th style={{ padding: '12px 8px' }}>Date</th>
                        <th style={{ padding: '12px 8px' }}>Coin</th>
                        <th style={{ padding: '12px 8px' }}>Runs</th>
                        <th style={{ padding: '12px 8px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partner.payments.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '12px 8px' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                          <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{p.coin_type}</td>
                          <td style={{ padding: '12px 8px' }}>{p.runs_requested}</td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              background: p.status === 'approved' ? 'rgba(0,255,136,0.1)' : p.status === 'declined' ? 'rgba(255,75,75,0.1)' : 'rgba(212,175,55,0.1)',
                              color: p.status === 'approved' ? '#00ff88' : p.status === 'declined' ? '#ff4b4b' : '#d4af37'
                            }}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px', margin: 0, textAlign: 'center', padding: '20px' }}>
                  No payment entries found.
                </p>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
