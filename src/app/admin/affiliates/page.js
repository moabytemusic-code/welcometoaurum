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
          padding: '20px 24px', 
          borderRadius: '16px', 
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <AlertTriangle color="#ff4444" size={28} />
          <div style={{ flex: 1 }}>
            <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', margin: 0 }}>Configuration Conflict</h4>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '4px 0 0 0' }}>
              {warnings.length} partner{warnings.length > 1 ? 's are' : ' is'} LIVE in the Rotator but {warnings.length > 1 ? 'have' : 'has'} <strong>no active funnels unlocked</strong>.
            </p>
          </div>
        </div>
      )}

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
              <th style={{ padding: '24px 32px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Partner</th>
              <th style={{ padding: '24px 32px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Main Code</th>
              <th style={{ padding: '24px 32px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Unlocked Funnels</th>
              <th style={{ padding: '24px 32px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Rotator</th>
              <th style={{ padding: '24px 32px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map(p => {
              const hasConfigIssue = p.is_rotator && (!p.unlocked_funnels || p.unlocked_funnels.trim() === '');
              return (
                <tr key={p.id} style={{ 
                  borderBottom: '1px solid rgba(255,255,255,0.03)', 
                  background: hasConfigIssue ? 'rgba(255,68,68,0.02)' : 'transparent'
                }}>
                  <td style={{ padding: '32px' }}>
                    <div style={{ fontWeight: '800', color: '#fff', fontSize: '15px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {p.full_name}
                      {hasConfigIssue && <AlertTriangle size={14} color="#ff4444" />}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{p.email}</div>
                  </td>
                  <td style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <code style={{ 
                        background: 'rgba(45, 140, 240, 0.08)', 
                        color: '#2d8cf0', 
                        padding: '6px 12px', 
                        borderRadius: '8px', 
                        fontSize: '12px',
                        fontWeight: '700',
                        border: '1px solid rgba(45,140,240,0.1)'
                      }}>{p.affiliate_code}</code>
                      <button 
                        onClick={() => openQr(`Master: ${p.full_name}`, `/?ref=${p.affiliate_code}`)}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.15)', cursor: 'pointer' }}
                      >
                        <QrCode size={18} />
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
                      {availableFunnels.map(f => {
                        const isUnlocked = (p.unlocked_funnels || '').includes(f.id);
                        return (
                          <div key={f.id} style={{ display: 'flex', alignItems: 'stretch', height: '32px' }}>
                            <button
                              onClick={() => toggleFunnel(p, f.id)}
                              style={{
                                padding: '0 16px',
                                borderRadius: '6px 0 0 6px',
                                fontSize: '11px',
                                fontWeight: '700',
                                border: '1px solid',
                                borderRight: 'none',
                                cursor: 'pointer',
                                background: isUnlocked ? 'rgba(45, 140, 240, 0.12)' : 'transparent',
                                borderColor: isUnlocked ? 'rgba(45,140,240,0.3)' : 'rgba(255,255,255,0.08)',
                                color: isUnlocked ? '#2d8cf0' : 'rgba(255,255,255,0.25)',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              {f.label}
                            </button>
                            {isUnlocked && (
                              <button 
                                onClick={() => openQr(`${f.label}: ${p.full_name}`, `/f/${f.id}/${f.angle || 'pitch'}?ref=${p.affiliate_code}`)}
                                style={{ 
                                  padding: '0 12px', 
                                  borderRadius: '0 6px 6px 0', 
                                  background: 'rgba(45, 140, 240, 0.15)', 
                                  border: '1px solid rgba(45,140,240,0.3)',
                                  borderLeft: 'none',
                                  color: '#2d8cf0',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <QrCode size={14} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '32px' }}>
                    <button 
                      onClick={() => toggleRotator(p)}
                      style={{ 
                        padding: '8px 20px', 
                        borderRadius: '100px', 
                        fontSize: '11px', 
                        fontWeight: '900', 
                        cursor: 'pointer',
                        background: p.is_rotator ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${p.is_rotator ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                        color: p.is_rotator ? '#00ff88' : 'rgba(255,255,255,0.2)'
                      }}
                    >
                      {p.is_rotator ? 'LIVE' : 'OFF'}
                    </button>
                  </td>
                  <td style={{ padding: '32px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                      <button onClick={() => { setEditingPartner(p); setShowEditModal(true); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><Edit2 size={18} /></button>
                      <button onClick={() => { setDeletingPartner(p); setShowDeleteModal(true); }} style={{ background: 'none', border: 'none', color: 'rgba(255, 68, 68, 0.25)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- QR MODAL (CLEANED UP) --- */}
      {showQrModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.modalContent} style={{ 
            maxWidth: '440px', 
            width: '90%',
            textAlign: 'center', 
            padding: '40px',
            background: '#111',
            borderRadius: '32px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
          }}>
            <button onClick={() => setShowQrModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={24} /></button>
            <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '8px', fontWeight: '800' }}>{qrData.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '32px' }}>Download or copy the link below</p>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '20px', display: 'inline-block', marginBottom: '32px' }}>
              <img src={qrImageUrl(qrData.url)} alt="QR" style={{ display: 'block', width: '280px', height: '280px' }} />
            </div>
            <div style={{ marginBottom: '32px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: '#2d8cf0', fontSize: '12px', wordBreak: 'break-all', textAlign: 'center', lineHeight: '1.6' }}>{qrData.url}</div>
            </div>
            {/* OVERRIDING CSS GLOBALS FOR THIS BUTTON */}
            <a 
              href={qrImageUrl(qrData.url)} 
              download={`QR_${qrData.title.replace(/\s+/g, '_')}.png`} 
              style={{ 
                textDecoration: 'none', 
                background: '#2d8cf0', 
                color: '#fff', 
                padding: '16px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px', 
                fontWeight: '800', 
                fontSize: '15px',
                border: 'none',
                boxShadow: 'none', // Kill the ghost glow
                cursor: 'pointer'
              }}
            >
              <Download size={20} /> Save Image
            </a>
          </div>
        </div>
      )}

      {/* Other Modals (Center Aligned) */}
      {showAddModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.modalContent} style={{ maxWidth: '500px', width: '90%', padding: '40px', background: '#111', borderRadius: '32px' }}>
            <h2 className={styles.modalTitle}>Register New Partner</h2>
            <form onSubmit={handleRegister} className={styles.modalForm}>
              <input type="text" placeholder="Full Name" required className={styles.modalInput} value={newPartner.full_name} onChange={(e) => setNewPartner({...newPartner, full_name: e.target.value})} />
              <input type="email" placeholder="Email Address" required className={styles.modalInput} value={newPartner.email} onChange={(e) => setNewPartner({...newPartner, email: e.target.value})} />
              <input type="text" placeholder="Affiliate Code" required className={styles.modalInput} value={newPartner.affiliate_code} onChange={(e) => setNewPartner({...newPartner, affiliate_code: e.target.value})} />
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button type="submit" className={styles.primaryCta} style={{ flex: 1, padding: '16px', borderRadius: '12px' }}>Complete Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
