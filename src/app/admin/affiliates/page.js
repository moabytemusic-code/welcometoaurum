'use client';

import { useState, useEffect } from 'react';
import { QrCode, Download, X } from 'lucide-react';
import styles from '@/app/finance.module.css';

export default function AffiliatesManager() {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPartner, setNewPartner] = useState({ full_name: '', email: '', affiliate_code: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncData, setSyncData] = useState(JSON.stringify([
    { "full_name": "John Doe", "email": "john@example.com", "affiliate_code": "JD100" },
    { "full_name": "Jane Smith", "email": "jane@example.com", "affiliate_code": "JS200" }
  ], null, 2));
  const [isSyncing, setIsSyncing] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrData, setQrData] = useState({ title: '', url: '' });
  const [isSessionAlive, setIsSessionAlive] = useState(null);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/admin/affiliates', { 
        headers: { 'Authorization': 'Bearer authenticated' },
        credentials: 'include',
        cache: 'no-store' 
      });
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const checkHeartbeat = async () => {
    try {
      const res = await fetch('/api/admin/auth/check', { 
        headers: { 'Authorization': 'Bearer authenticated' },
        credentials: 'include',
        cache: 'no-store' 
      });
      const data = await res.json();
      setIsSessionAlive(data.authenticated);
    } catch (e) {
      setIsSessionAlive(false);
    }
  };

  useEffect(() => {
    fetchPartners();
    checkHeartbeat();
    const interval = setInterval(checkHeartbeat, 30000);
    return () => clearInterval(interval);
  }, []);

  const togglePromoted = async (partner) => {
    const updated = !partner.is_promoted;
    const res = await fetch('/api/admin/affiliates', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer authenticated'
      },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify({ id: partner.id, is_promoted: updated }),
    });
    
    if (res.ok) {
      setPartners(partners.map(p => p.id === partner.id ? { ...p, is_promoted: updated } : p));
    }
  };

  const toggleFunnel = async (partner, funnelId) => {
    let current = (partner.unlocked_funnels || 'pitch').split(',').map(s => s.trim()).filter(Boolean);
    let updated;
    
    if (current.includes(funnelId)) {
      updated = current.filter(id => id !== funnelId);
    } else {
      updated = [...current, funnelId];
    }
    
    // Always ensure at least 'pitch' stays or handle empty state
    const updatedString = updated.join(',');

    const res = await fetch('/api/admin/affiliates', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer authenticated'
      },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify({ id: partner.id, unlocked_funnels: updatedString }),
    });
    
    if (res.ok) {
      setPartners(partners.map(p => p.id === partner.id ? { ...p, unlocked_funnels: updatedString } : p));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer authenticated'
        },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify(newPartner),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewPartner({ full_name: '', email: '', affiliate_code: '', phone: '' });
        fetchPartners();
      }
    } catch (e) {
      console.error('Registration error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSync = async (e) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      let parsed;
      try {
        parsed = JSON.parse(syncData);
      } catch (err) {
        alert('Invalid JSON format. Please ensure you are pasting a valid array of partners.');
        setIsSyncing(false);
        return;
      }

      const res = await fetch('/api/admin/affiliates/import', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer authenticated'
        },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ partners: Array.isArray(parsed) ? parsed : [parsed] }),
      });

      const contentType = res.headers.get('content-type');
      let result = {};
      
      if (contentType && contentType.includes('application/json')) {
        result = await res.json();
      } else {
        const text = await res.text();
        console.error('Non-JSON response received:', text);
        result = { error: 'Server returned an unexpected response format.' };
      }

      if (res.ok) {
        alert(`SUCCESS: Imported ${result.count} partners.`);
        setShowSyncModal(false);
        setSyncData('');
        fetchPartners();
      } else {
        console.error(`Import API Failure [${res.status}]:`, result);
        const msg = result.error || 'Server error';
        const cause = result.cause ? `\n\nCAUSE: ${result.cause}` : '';
        const sanity = result.sanity || result.diagnostics?.sanityStatus ? `\n\nSANITY PING: ${result.sanity || result.diagnostics?.sanityStatus}` : '';
        const url = result.diagnostics?.urlMetrics ? `\n\nURL LEN: ${result.diagnostics.urlMetrics.length} | SPACES: ${result.diagnostics.urlMetrics.hasSpace}` : '';
        
        alert(`IMPORT FAILED (Status ${res.status})\n\nDetail: ${msg}${cause}${sanity}${url}\n\nTIP: If status is 401, please log out and back in.`);
      }
    } catch (e) {
      console.error('Sync error:', e);
      alert('An error occurred during synchronization.');
    } finally {
      setIsSyncing(false);
    }
  };

  const availableFunnels = [
    { id: 'pitch', label: 'Pitch' },
    { id: 'consultative', label: 'Consultative' },
    { id: 'breakdown', label: 'Breakdown' },
    { id: 'v3', label: 'V3' },
    { id: 'v4', label: 'V4' }
  ];

  const filteredPartners = partners.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.affiliate_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openQr = (title, url) => {
    const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
    setQrData({ title, url: fullUrl });
    setShowQrModal(true);
  };

  const qrImageUrl = (data) => `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 className={styles.sectionTitle} style={{ textAlign: 'left', marginBottom: '8px' }}>Partner Management</h1>
          <p className={styles.sectionSub} style={{ textAlign: 'left' }}>Oversee the active affiliate pool and manage funnel access.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => setShowAddModal(true)}
            className={styles.primaryCta} 
            style={{ padding: '12px 24px', fontSize: '14px' }}
          >
            + Add New Partner
          </button>
          <button 
            onClick={() => openQr('Global Rotator', '/')}
            className={styles.secondaryBtn} 
            style={{ 
              padding: '12px 20px', 
              fontSize: '14px',
              background: 'rgba(45, 140, 240, 0.05)',
              border: '1px solid rgba(45, 140, 240, 0.1)',
              color: '#2d8cf0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <QrCode size={16} /> Rotator QR
          </button>
          <button 
            onClick={() => setShowSyncModal(true)}
            className={styles.secondaryBtn} 
            style={{ 
              padding: '12px 20px', 
              fontSize: '14px',
              background: 'rgba(0, 255, 136, 0.05)',
              border: '1px solid rgba(0, 255, 136, 0.1)',
              color: '#00ff88',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Bulk Sync
          </button>
          <input 
            type="text" 
            placeholder="Search partners..." 
            className={styles.modalInput}
            style={{ maxWidth: '250px', marginBottom: '0' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showAddModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 100 }}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
            <h2 className={styles.modalTitle}>Register New Partner</h2>
            <form onSubmit={handleRegister} className={styles.modalForm}>
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                className={styles.modalInput}
                value={newPartner.full_name}
                onChange={(e) => setNewPartner({...newPartner, full_name: e.target.value})}
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                className={styles.modalInput}
                value={newPartner.email}
                onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Affiliate Reference Code" 
                required 
                className={styles.modalInput}
                value={newPartner.affiliate_code}
                onChange={(e) => setNewPartner({...newPartner, affiliate_code: e.target.value})}
              />
              <input 
                type="tel" 
                placeholder="Phone (Optional)" 
                className={styles.modalInput}
                value={newPartner.phone}
                onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
              />
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" disabled={isSubmitting} className={styles.primaryCta} style={{ flex: 1 }}>
                  {isSubmitting ? 'Registering...' : 'Complete Registration'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className={styles.secondaryBtn} 
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '0 24px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showSyncModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 100 }}>
          <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
            <h2 className={styles.modalTitle}>Bulk Partner Sync</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
              Paste a JSON array of partners to import them in bulk. Required fields per object: <code>email</code>, <code>full_name</code>, <code>affiliate_code</code>.
            </p>
            <form onSubmit={handleBulkSync} className={styles.modalForm}>
              <textarea 
                placeholder='[{"full_name": "Bob", "email": "bob@example.com", "affiliate_code": "BOB123"}]'
                required 
                className={styles.modalInput}
                style={{ minHeight: '200px', fontFamily: 'monospace', fontSize: '12px', padding: '15px' }}
                value={syncData}
                onChange={(e) => setSyncData(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" disabled={isSyncing} className={styles.primaryCta} style={{ flex: 1, background: '#00ff88', color: '#000' }}>
                  {isSyncing ? 'Syncing...' : 'Start Bulk Import'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowSyncModal(false)} 
                  className={styles.secondaryBtn} 
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '0 24px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ 
        background: 'rgba(255,255,255,0.02)', 
        border: '1px solid rgba(255,255,255,0.05)', 
        borderRadius: '24px', 
        overflow: 'hidden' 
      }}>
        {isLoading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Scanning Affiliate Nodes...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ textAlign: 'left', padding: '20px 24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Partner</th>
                <th style={{ textAlign: 'left', padding: '20px 24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Code</th>
                <th style={{ textAlign: 'left', padding: '20px 24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Unlocked Funnels</th>
                <th style={{ textAlign: 'left', padding: '20px 24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Last Served</th>
                <th style={{ textAlign: 'center', padding: '20px 24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Rotator</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.map((p) => {
                const unlocked = (p.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontWeight: '700', fontSize: '14px' }}>{p.full_name}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{p.email}</div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <code style={{ background: 'rgba(45, 140, 240, 0.1)', color: '#2d8cf0', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>{p.affiliate_code}</code>
                        <button 
                          onClick={() => openQr(`Partner: ${p.full_name}`, `/?ref=${p.affiliate_code}`)}
                          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex' }}
                          title="Generate QR Code"
                        >
                          <QrCode size={14} />
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {availableFunnels.map(f => {
                          const isUnlocked = unlocked.includes(f.id);
                          return (
                            <button
                              key={f.id}
                              onClick={() => toggleFunnel(p, f.id)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '100px',
                                fontSize: '10px',
                                fontWeight: '700',
                                border: '1px solid',
                                cursor: 'pointer',
                                background: isUnlocked ? 'rgba(45, 140, 240, 0.15)' : 'transparent',
                                borderColor: isUnlocked ? '#2d8cf0' : 'rgba(255,255,255,0.1)',
                                color: isUnlocked ? '#2d8cf0' : 'rgba(255,255,255,0.3)',
                                transition: 'all 0.2s'
                              }}
                            >
                              {f.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                        {p.last_served_at ? new Date(p.last_served_at).toLocaleString() : 'Never'}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                      <button 
                        onClick={() => togglePromoted(p)}
                        style={{
                          background: p.is_promoted ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${p.is_promoted ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                          color: p.is_promoted ? '#00ff88' : 'rgba(255,255,255,0.3)',
                          padding: '6px 16px',
                          borderRadius: '100px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {p.is_promoted ? 'LIVE' : 'OFF'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) }
      </div>

      {showQrModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 110 }}>
          <div className={styles.modalContent} style={{ maxWidth: '380px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className={styles.modalTitle} style={{ margin: 0 }}>QR Resolution</h2>
              <button 
                onClick={() => setShowQrModal(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ 
              background: '#fff', 
              padding: '16px', 
              borderRadius: '16px', 
              display: 'inline-block',
              marginBottom: '24px',
              boxShadow: '0 0 40px rgba(45, 140, 240, 0.3)'
            }}>
              <img 
                src={qrImageUrl(qrData.url)} 
                alt="QR Code" 
                style={{ display: 'block', width: '250px', height: '250px' }}
              />
            </div>
            
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '24px' }}>
              Pointing to:<br/>
              <code style={{ color: '#2d8cf0', fontSize: '11px', wordBreak: 'break-all' }}>{qrData.url}</code>
            </p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <a 
                href={qrImageUrl(qrData.url)} 
                download={`QR_${qrData.title.replace(/\s+/g, '_')}.png`}
                className={styles.primaryCta}
                style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={18} /> Save Image
              </a>
              <button 
                onClick={() => setShowQrModal(false)}
                className={styles.secondaryBtn}
                style={{ flex: 0.5 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Production Debug Footer */}
      <div style={{ 
        marginTop: '60px', 
        padding: '24px', 
        textAlign: 'center', 
        borderTop: '1px solid rgba(255,255,255,0.05)',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '11px'
      }}>
        Server Session Status: <span style={{ color: isSessionAlive === true ? '#00ff88' : isSessionAlive === false ? '#ff4444' : '#ffcc00' }}>
          {isSessionAlive === true ? 'ACTIVE (Verified by Server)' : isSessionAlive === false ? 'INACTIVE (No Valid Cookie Found)' : 'CONNECTING...'}
        </span>
        <div style={{ marginTop: '8px' }}>
          Production Node Path: /admin/affiliates • Vercel Edge Optimized
        </div>
      </div>
    </div>
  );
}

