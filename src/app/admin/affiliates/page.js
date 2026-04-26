'use client';

import { useState, useEffect } from 'react';
import { QrCode, Download, X, Edit2, Save, Trash2, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import styles from '@/app/finance.module.css';
import Link from 'next/link';

export default function AffiliatesManager() {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Form States
  const [newPartner, setNewPartner] = useState({ full_name: '', email: '', affiliate_code: '', phone: '' });
  const [editingPartner, setEditingPartner] = useState(null);
  const [deletingPartner, setDeletingPartner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [qrData, setQrData] = useState({ title: '', url: '' });
  const [isSessionAlive, setIsSessionAlive] = useState(null);
  const [availableFunnels, setAvailableFunnels] = useState([]);

  // Validation
  const [warnings, setWarnings] = useState([]);

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
        validatePartners(data);
      }
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePartners = (data) => {
    const issues = data.filter(p => p.is_rotator && (!p.unlocked_funnels || p.unlocked_funnels.trim() === ''));
    setWarnings(issues);
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects/list');
      const data = await res.json();
      const activeOnly = data.filter(p => p.isActive === true);
      setAvailableFunnels(activeOnly.map(p => ({ id: p.slug, label: p.name, angle: p.angle })));
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
      const updatedList = partners.map(p => p.id === partner.id ? { ...p, is_rotator: updated } : p);
      setPartners(updatedList);
      validatePartners(updatedList);
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

  const performDelete = async () => {
    if (!deletingPartner) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/affiliates?id=${deletingPartner.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer authenticated' },
        credentials: 'include',
        cache: 'no-store'
      });
      
      if (res.ok) {
        const updatedList = partners.filter(p => p.id !== deletingPartner.id);
        setPartners(updatedList);
        validatePartners(updatedList);
        setShowDeleteModal(false);
        setDeletingPartner(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFunnel = async (partner, funnelId) => {
    let current = (partner.unlocked_funnels || '').split(',').map(s => s.trim()).filter(Boolean);
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
      const updatedList = partners.map(p => p.id === partner.id ? { ...p, unlocked_funnels: updatedString } : p);
      setPartners(updatedList);
      validatePartners(updatedList);
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

      {/* Global Warnings Banner */}
      {warnings.length > 0 && (
        <div style={{ 
          background: 'rgba(255, 68, 68, 0.1)', 
          border: '1px solid rgba(255, 68, 68, 0.2)', 
          padding: '16px 24px', 
          borderRadius: '16px', 
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          animation: 'pulse 2s infinite ease-in-out'
        }}>
          <AlertTriangle color="#ff4444" size={24} />
          <div style={{ flex: 1 }}>
            <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '700', margin: 0 }}>Configuration Warning</h4>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '4px 0 0 0' }}>
              {warnings.length} partner{warnings.length > 1 ? 's are' : ' is'} set to LIVE in the Rotator but {warnings.length > 1 ? 'have' : 'has'} <strong>zero funnels unlocked</strong>. They will never receive leads.
            </p>
          </div>
        </div>
      )}

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
              <th style={{ padding: '20px 24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Main Code</th>
              <th style={{ padding: '20px 24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Unlocked Funnels (Click for QR)</th>
              <th style={{ padding: '20px 24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Rotator Status</th>
              <th style={{ padding: '20px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map(p => {
              const hasConfigIssue = p.is_rotator && (!p.unlocked_funnels || p.unlocked_funnels.trim() === '');
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: hasConfigIssue ? 'rgba(255,68,68,0.02)' : 'transparent' }}>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {p.full_name}
                      {hasConfigIssue && <AlertTriangle size={14} color="#ff4444" title="Configuration Error: No Funnels Unlocked" />}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{p.email}</div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <code style={{ background: 'rgba(45, 140, 240, 0.1)', color: '#2d8cf0', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>{p.affiliate_code}</code>
                      <button 
                        onClick={() => openQr(`Master: ${p.full_name}`, `/?ref=${p.affiliate_code}`)}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}
                        title="Root QR Code"
                      >
                        <QrCode size={14} />
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {availableFunnels.map(f => {
                        const isUnlocked = (p.unlocked_funnels || '').includes(f.id);
                        return (
                          <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <button
                              onClick={() => toggleFunnel(p, f.id)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '100px 0 0 100px',
                                fontSize: '10px',
                                fontWeight: '700',
                                border: '1px solid',
                                borderRight: 'none',
                                cursor: 'pointer',
                                background: isUnlocked ? 'rgba(45, 140, 240, 0.15)' : 'transparent',
                                borderColor: isUnlocked ? '#2d8cf0' : 'rgba(255,255,255,0.1)',
                                color: isUnlocked ? '#2d8cf0' : 'rgba(255,255,255,0.3)',
                              }}
                            >
                              {f.label}
                            </button>
                            {isUnlocked && (
                              <button 
                                onClick={() => openQr(`${f.label}: ${p.full_name}`, `/f/${f.id}/${f.angle || 'pitch'}?ref=${p.affiliate_code}`)}
                                style={{ 
                                  padding: '4px 8px', 
                                  borderRadius: '0 100px 100px 0', 
                                  background: 'rgba(45, 140, 240, 0.1)', 
                                  border: '1px solid #2d8cf0',
                                  borderLeft: 'none',
                                  color: '#2d8cf0',
                                  cursor: 'pointer',
                                  display: 'flex'
                                }}
                                title={`Get QR for ${f.label}`}
                              >
                                <QrCode size={12} />
                              </button>
                            )}
                          </div>
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
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                      <button onClick={() => { setEditingPartner(p); setShowEditModal(true); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                      <button onClick={() => { setDeletingPartner(p); setShowDeleteModal(true); }} style={{ background: 'none', border: 'none', color: 'rgba(255, 68, 68, 0.3)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals (Keep existing modals) */}
      {showAddModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 100 }}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
            <h2 className={styles.modalTitle}>Register New Partner</h2>
            <form onSubmit={handleRegister} className={styles.modalForm}>
              <input type="text" placeholder="Full Name" required className={styles.modalInput} value={newPartner.full_name} onChange={(e) => setNewPartner({...newPartner, full_name: e.target.value})} />
              <input type="email" placeholder="Email Address" required className={styles.modalInput} value={newPartner.email} onChange={(e) => setNewPartner({...newPartner, email: e.target.value})} />
              <input type="text" placeholder="Affiliate Reference Code" required className={styles.modalInput} value={newPartner.affiliate_code} onChange={(e) => setNewPartner({...newPartner, affiliate_code: e.target.value})} />
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" disabled={isSubmitting} className={styles.primaryCta} style={{ flex: 1 }}>{isSubmitting ? 'Registering...' : 'Complete Registration'}</button>
                <button type="button" onClick={() => setShowAddModal(false)} className={styles.secondaryBtn} style={{ padding: '0 24px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingPartner && (
        <div className={styles.modalOverlay} style={{ zIndex: 100 }}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
            <h2 className={styles.modalTitle}>Edit Partner</h2>
            <form onSubmit={handleEditSubmit} className={styles.modalForm}>
              <input type="text" required className={styles.modalInput} value={editingPartner.full_name} onChange={(e) => setEditingPartner({...editingPartner, full_name: e.target.value})} />
              <input type="email" required className={styles.modalInput} value={editingPartner.email} onChange={(e) => setEditingPartner({...editingPartner, email: e.target.value})} />
              <textarea className={styles.modalInput} style={{ minHeight: '100px', fontFamily: 'monospace' }} value={editingPartner.rotator_pool} onChange={(e) => setEditingPartner({...editingPartner, rotator_pool: e.target.value})} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={isSubmitting} className={styles.primaryCta} style={{ flex: 1 }}>{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" onClick={() => setShowEditModal(false)} className={styles.secondaryBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && deletingPartner && (
        <div className={styles.modalOverlay} style={{ zIndex: 120 }}>
          <div className={styles.modalContent} style={{ maxWidth: '400px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#ff4444" style={{ margin: '0 auto 20px' }} />
            <h2 className={styles.modalTitle}>Confirm Deletion</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>Remove <strong>{deletingPartner.full_name}</strong> permanently?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={performDelete} className={styles.primaryCta} style={{ flex: 1, background: '#ff4444' }}>Delete</button>
              <button onClick={() => setShowDeleteModal(false)} className={styles.secondaryBtn} style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showQrModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 110 }}>
          <div className={styles.modalContent} style={{ maxWidth: '380px', textAlign: 'center' }}>
            <h2 className={styles.modalTitle}>{qrData.title}</h2>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', display: 'inline-block', marginBottom: '24px' }}>
              <img src={qrImageUrl(qrData.url)} alt="QR" style={{ display: 'block', width: '250px' }} />
            </div>
            <p style={{ color: '#2d8cf0', fontSize: '11px', wordBreak: 'break-all' }}>{qrData.url}</p>
            <a href={qrImageUrl(qrData.url)} download={`QR_${qrData.title}.png`} className={styles.primaryCta} style={{ textDecoration: 'none' }}><Download size={18} /> Save Image</a>
          </div>
        </div>
      )}
    </div>
  );
}
