'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/admin/admin.module.css';
import { Network, CheckCircle2, XCircle, Users, ExternalLink, Settings2, Trash2, Plus, Loader2 } from 'lucide-react';

export default function RotatorManager() {
  const [rotators, setRotators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [activeRotator, setActiveRotator] = useState(null);
  const [entries, setEntries] = useState([]);
  const [isEntriesLoading, setIsEntriesLoading] = useState(false);
  
  // New Entry Form State
  const [newEntry, setNewEntry] = useState({ member_id: '', target_conversions: 9, queue_position: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchRotators();
  }, []);

  const fetchRotators = async () => {
    try {
      const res = await fetch('/api/admin/rotators/list');
      const data = await res.json();
      setRotators(data);
    } catch (err) {
      console.error('Failed to load rotators', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRotatorStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setRotators(rotators.map(r => r.id === id ? { ...r, status: newStatus } : r));
    
    try {
      await fetch('/api/admin/rotators/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, newStatus })
      });
    } catch (err) {
      console.error('Failed to toggle rotator', err);
      fetchRotators();
    }
  };

  // --- Entries Manager Logic ---

  const openManager = async (rotator) => {
    setActiveRotator(rotator);
    setIsEntriesLoading(true);
    setNewEntry({ member_id: '', target_conversions: 9, queue_position: (rotator.total_members || 0) + 1 });
    
    try {
      const res = await fetch(`/api/admin/rotators/entries?rotator_id=${rotator.id}`);
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error('Failed to fetch entries', err);
    } finally {
      setIsEntriesLoading(false);
    }
  };

  const closeManager = () => {
    setActiveRotator(null);
    setEntries([]);
    // Refresh main list in case counts changed
    fetchRotators();
  };

  const handleSearchUsers = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/admin/affiliates?search=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectUser = (affiliate_code) => {
    setNewEntry({...newEntry, member_id: affiliate_code});
    setSearchResults([]);
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/admin/rotators/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rotator_id: activeRotator.id,
          ...newEntry
        })
      });
      
      if (res.ok) {
        const { entry } = await res.json();
        setEntries([...entries, entry].sort((a, b) => a.queue_position - b.queue_position));
        setNewEntry({ member_id: '', target_conversions: 9, queue_position: newEntry.queue_position + 1 });
        setSearchResults([]);
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Failed to add entry', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member from the queue?")) return;
    
    // Optimistic UI update
    setEntries(entries.filter(e => e.id !== id));
    
    try {
      await fetch('/api/admin/rotators/entries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (err) {
      console.error('Failed to delete entry', err);
      // Re-fetch on error to revert
      const res = await fetch(`/api/admin/rotators/entries?rotator_id=${activeRotator.id}`);
      const data = await res.json();
      setEntries(data);
    }
  };

  return (
    <main className={styles.builderMain}>
      <div className={styles.builderGlow} />
      
      <div className={styles.container} style={{ maxWidth: '1000px' }}>
        <header className={styles.header}>
          <div className={styles.badge}>Rotator Engine v2.0</div>
          <h1 className={styles.title}>Manage <span className={styles.highlight}>Downlines</span></h1>
          <p className={styles.subtitle}>Control traffic distribution and queue assignments for your teams.</p>
        </header>

        <div className={styles.card} style={{ padding: '0', overflow: 'hidden' }}>
          <div className={styles.sectionHeader} style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', margin: 0 }}>
            <Network className={styles.icon} />
            <h2>Active Rotators</h2>
          </div>

          {isLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading rotators...</div>
          ) : rotators.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No rotators found in the database.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {rotators.map((rotator, idx) => (
                <div key={rotator.id} 
                  className={styles.campaignRow}
                  style={{ 
                    borderBottom: idx !== rotators.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: rotator.status === 'ACTIVE' ? 'transparent' : 'rgba(255,0,0,0.02)',
                    padding: '24px 32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {rotator.name}
                      {rotator.status === 'ACTIVE' ? (
                        <span style={{ fontSize: '10px', background: 'rgba(0,255,136,0.1)', color: '#00ff88', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Active</span>
                      ) : (
                        <span style={{ fontSize: '10px', background: 'rgba(255,50,50,0.1)', color: '#ff3232', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Paused</span>
                      )}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span><strong>Type:</strong> {rotator.type}</span>
                      <span><strong>API Slug:</strong> /api/r/{rotator.slug}</span>
                      {rotator.funnel_url && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d4af37' }}>
                          <ExternalLink size={12} />
                          <a href={rotator.funnel_url} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Funnel: {rotator.funnel_url}</a>
                        </span>
                      )}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> Members</span>
                      <span style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{rotator.total_members || 0}</span>
                    </div>

                    <button 
                      onClick={() => openManager(rotator)}
                      style={{
                        background: 'rgba(212,175,55,0.1)',
                        color: '#d4af37',
                        border: '1px solid rgba(212,175,55,0.3)',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,175,55,0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(212,175,55,0.1)'}
                    >
                      <Settings2 size={16} />
                      Manage Queue
                    </button>

                    <button 
                      onClick={() => toggleRotatorStatus(rotator.id, rotator.status)}
                      style={{
                        background: rotator.status === 'ACTIVE' ? 'rgba(255,50,50,0.1)' : 'rgba(0,255,136,0.1)',
                        color: rotator.status === 'ACTIVE' ? '#ff3232' : '#00ff88',
                        border: rotator.status === 'ACTIVE' ? '1px solid rgba(255,50,50,0.2)' : '1px solid rgba(0,255,136,0.2)',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        minWidth: '130px',
                        justifyContent: 'center'
                      }}
                    >
                      {rotator.status === 'ACTIVE' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                      {rotator.status === 'ACTIVE' ? 'Pause Traffic' : 'Activate Traffic'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- QUEUE MANAGER MODAL --- */}
      {activeRotator && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', width: '100%', maxWidth: '800px',
            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', maxHeight: '90vh'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Queue Manager</h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Rotator: <strong>{activeRotator.name}</strong> ({activeRotator.type})</p>
              </div>
              <button 
                onClick={closeManager}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '8px' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              
              {/* Left Side: Current Queue */}
              <div style={{ flex: 3, borderRight: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', fontWeight: 'bold' }}>Current Members in Queue</h3>
                
                {isEntriesLoading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading queue...</div>
                ) : entries.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                    No members assigned to this rotator yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {entries.map((entry) => (
                      <div key={entry.id} style={{ 
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', 
                        borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' 
                      }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', 
                          color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' 
                        }}>
                          {entry.queue_position}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px' }}>{entry.member_id}</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                            Status: <span style={{ color: entry.status === 'COMPLETED' ? '#ff3232' : '#00ff88' }}>{entry.status}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', paddingRight: '16px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Progress</div>
                          <div style={{ fontWeight: 'bold', color: '#fff' }}>{entry.current_conversions} / {entry.target_conversions}</div>
                        </div>

                        <button 
                          onClick={() => handleDeleteEntry(entry.id)}
                          style={{ background: 'none', border: 'none', color: 'rgba(255,50,50,0.5)', cursor: 'pointer', padding: '8px' }}
                          title="Remove Member"
                          onMouseEnter={(e) => e.currentTarget.style.color = '#ff3232'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,50,50,0.5)'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Add Form */}
              <div style={{ flex: 2, padding: '24px', background: 'rgba(255,255,255,0.01)' }}>
                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', fontWeight: 'bold' }}>Add Member</h3>
                
                <form onSubmit={handleAddEntry} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Affiliate ID or Search by Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., John Doe or 1W145K"
                      value={newEntry.member_id}
                      onChange={e => {
                        setNewEntry({...newEntry, member_id: e.target.value});
                        handleSearchUsers(e.target.value);
                      }}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                    />
                    
                    {/* Search Results Dropdown */}
                    {searchResults.length > 0 && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', marginTop: '4px', zIndex: 10, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
                        {searchResults.map(user => (
                          <div 
                            key={user.id} 
                            onClick={() => selectUser(user.affiliate_code)}
                            style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <span style={{ color: '#fff', fontSize: '14px' }}>{user.full_name}</span>
                            <span style={{ color: '#d4af37', fontSize: '12px', fontWeight: 'bold' }}>{user.affiliate_code}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {isSearching && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Searching...</div>}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Target</label>
                      <input 
                        type="number" 
                        required min="1"
                        value={newEntry.target_conversions}
                        onChange={e => setNewEntry({...newEntry, target_conversions: parseInt(e.target.value) || 0})}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Pos.</label>
                      <input 
                        type="number" 
                        required min="1"
                        value={newEntry.queue_position}
                        onChange={e => setNewEntry({...newEntry, queue_position: parseInt(e.target.value) || 1})}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: '#d4af37', color: '#000', border: 'none', borderRadius: '8px', padding: '14px',
                      fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      marginTop: '8px', opacity: isSubmitting ? 0.7 : 1
                    }}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                    Add to Queue
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}
