'use client';

import { useState, useEffect } from 'react';
import { QrCode, Download, X, Edit2, Save } from 'lucide-react';
import styles from '@/app/finance.module.css';
import Link from 'next/link';

export default function AffiliatesManager() {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Form States
  const [newPartner, setNewPartner] = useState({ full_name: '', email: '', affiliate_code: '', phone: '' });
  const [editingPartner, setEditingPartner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [qrData, setQrData] = useState({ title: '', url: '' });
  const [isSessionAlive, setIsSessionAlive] = useState(null);
  const [availableFunnels, setAvailableFunnels] = useState([]);

  useEffect(() => {
    fetchPartners();
    fetchProjects();
    checkHeartbeat();
    const interval = setInterval(checkHeartbeat, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects/list');
      const data = await res.json();
      setAvailableFunnels(data.map(p => ({ id: p.slug, label: p.name })));
    } catch (e) {
      console.error('Fetch projects error:', e);
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

  const toggleRotator = async (partner) => {
    const updated = !partner.is_rotator;
    const res = await fetch('/api/admin/affiliates', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer authenticated'
      },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify({ id: partner.id, is_rotator: updated }),
    });
    
    if (res.ok) {
      setPartners(partners.map(p => p.id === partner.id ? { ...p, is_rotator: updated } : p));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { id, created_at, last_served_at, ...updates } = editingPartner;
      const res = await fetch('/api/admin/affiliates', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer authenticated'
        },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        setShowEditModal(false);
        fetchPartners();
      }
    } catch (e) {
      console.error('Update error:', e);
    } finally {
      setIsSubmitting(false);
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
    <div className={styles.adminContainer} style={{ background: '#050505', minHeight: '100vh', padding: '60px 40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginBottom: '8px' }}>Partner Ecosystem</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Manage affiliates, permissions, and traffic rotation.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => setShowAddModal(true)} className={styles.primaryCta} style={{ padding: '12px 24px', fontSize: '14px' }}>
            + Add New Partner
          </button>
          <Link href="/admin" className={styles.secondaryBtn} style={{ padding: '12px 24px', textDecoration: 'none' }}>← Back to Admin</Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsGrid} style={{ marginBottom: '40px' }}>
        <div className={styles.statCard}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px' }}>Total Partners</span>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>{partners.length}</div>
        </div>
        <div className={styles.statCard}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px' }}>Active in Rotator</span>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#00ff88' }}>
            {partners.filter(p => p.is_rotator).length}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="Search by name or code..." 
          className={styles.modalInput}
          style={{ maxWidth: '400px', marginBottom: '0' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Container */}
      <div style={{ 
        background: 'rgba(255,255,255,0.02)', 
        border: '1px solid rgba(255,255,255,0.05)', 
        borderRadius: '24px', 
        overflow: 'hidden' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '20px 24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Partner</th>
              <th style={{ padding: '20px 24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Code</th>
              <th style={{ padding: '20px 24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Unlocked Funnels</th>
              <th style={{ padding: '20px 24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Rotator Status</th>
              <th style={{ padding: '20px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ fontWeight: '700', color: '#fff' }}>{p.full_name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{p.email}</div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <code style={{ background: 'rgba(45, 140, 240, 0.1)', color: '#2d8cf0', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>{p.affiliate_code}</code>
                    <button onClick={() => openQr(p.full_name, `/?ref=${p.affiliate_code}`)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><QrCode size={14} /></button>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {availableFunnels.map(f => {
                      const isUnlocked = (p.unlocked_funnels || 'pitch').includes(f.id);
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
                          }}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <button 
                    onClick={() => toggleRotator(p)}
                    style={{ 
                      padding: '6px 16px', 
                      borderRadius: '100px', 
                      fontSize: '10px', 
                      fontWeight: '900', 
                      cursor: 'pointer',
                      background: p.is_rotator ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${p.is_rotator ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                      color: p.is_rotator ? '#00ff88' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {p.is_rotator ? 'LIVE' : 'OFF'}
                  </button>
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                  <button 
                    onClick={() => { setEditingPartner(p); setShowEditModal(true); }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                  >
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODALS --- */}

      {/* Add Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 100 }}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
            <h2 className={styles.modalTitle}>Register New Partner</h2>
            <form onSubmit={handleRegister} className={styles.modalForm}>
              <input type="text" placeholder="Full Name" required className={styles.modalInput} value={newPartner.full_name} onChange={(e) => setNewPartner({...newPartner, full_name: e.target.value})} />
              <input type="email" placeholder="Email Address" required className={styles.modalInput} value={newPartner.email} onChange={(e) => setNewPartner({...newPartner, email: e.target.value})} />
              <input type="text" placeholder="Affiliate Reference Code" required className={styles.modalInput} value={newPartner.affiliate_code} onChange={(e) => setNewPartner({...newPartner, affiliate_code: e.target.value})} />
              <input type="tel" placeholder="Phone (Optional)" className={styles.modalInput} value={newPartner.phone} onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})} />
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" disabled={isSubmitting} className={styles.primaryCta} style={{ flex: 1 }}>{isSubmitting ? 'Registering...' : 'Complete Registration'}</button>
                <button type="button" onClick={() => setShowAddModal(false)} className={styles.secondaryBtn} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0 24px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingPartner && (
        <div className={styles.modalOverlay} style={{ zIndex: 100 }}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className={styles.modalTitle} style={{ margin: 0 }}>Edit Partner</h2>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit} className={styles.modalForm}>
              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
              <input type="text" required className={styles.modalInput} value={editingPartner.full_name} onChange={(e) => setEditingPartner({...editingPartner, full_name: e.target.value})} />
              
              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
              <input type="email" required className={styles.modalInput} value={editingPartner.email} onChange={(e) => setEditingPartner({...editingPartner, email: e.target.value})} />
              
              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Affiliate Code (Careful!)</label>
              <input type="text" required className={styles.modalInput} value={editingPartner.affiliate_code} onChange={(e) => setEditingPartner({...editingPartner, affiliate_code: e.target.value})} />
              
              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Rotator Pool (JSON or Comma List)</label>
              <textarea 
                className={styles.modalInput} 
                style={{ minHeight: '100px', fontFamily: 'monospace', fontSize: '12px' }} 
                value={editingPartner.rotator_pool} 
                onChange={(e) => setEditingPartner({...editingPartner, rotator_pool: e.target.value})} 
              />

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" disabled={isSubmitting} className={styles.primaryCta} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setShowEditModal(false)} className={styles.secondaryBtn} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0 24px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQrModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 110 }}>
          <div className={styles.modalContent} style={{ maxWidth: '380px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className={styles.modalTitle} style={{ margin: 0 }}>QR Resolution</h2>
              <button onClick={() => setShowQrModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', display: 'inline-block', marginBottom: '24px' }}>
              <img src={qrImageUrl(qrData.url)} alt="QR" style={{ display: 'block', width: '250px', height: '250px' }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '24px' }}>Pointing to:<br/><code style={{ color: '#2d8cf0', fontSize: '11px', wordBreak: 'break-all' }}>{qrData.url}</code></p>
            <a href={qrImageUrl(qrData.url)} download={`QR_${qrData.title.replace(/\s+/g, '_')}.png`} className={styles.primaryCta} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Download size={18} /> Save Image</a>
          </div>
        </div>
      )}
    </div>
  );
}
