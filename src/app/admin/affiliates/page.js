'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/finance.module.css';

export default function AffiliatesManager() {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPartner, setNewPartner] = useState({ full_name: '', email: '', affiliate_code: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/admin/affiliates');
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

  useEffect(() => {
    fetchPartners();
  }, []);

  const togglePromoted = async (partner) => {
    const updated = !partner.is_promoted;
    const res = await fetch('/api/admin/affiliates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
          <input 
            type="text" 
            placeholder="Search partners..." 
            className={styles.modalInput}
            style={{ maxWidth: '300px', marginBottom: '0' }}
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
                      <code style={{ background: 'rgba(45, 140, 240, 0.1)', color: '#2d8cf0', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>{p.affiliate_code}</code>
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
    </div>
  );
}

