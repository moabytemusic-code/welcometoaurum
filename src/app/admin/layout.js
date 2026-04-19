'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from '@/app/finance.module.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Special case for login page - don't show sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: '📊' },
    { label: 'Affiliates', path: '/admin/affiliates', icon: '🤝' },
    { label: 'Funnels', path: '/admin/funnels', icon: '🚀' },
    { label: 'Audience Segments', path: '/admin/segments', icon: '👥' },
  ];

  return (
    <div className={styles.main} style={{ display: 'flex', minHeight: '100vh', background: '#050505' }}>
      {/* Sidebar Navigation */}
      <aside style={{ 
        width: '260px', 
        borderRight: '1px solid rgba(255,255,255,0.05)', 
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: '#2d8cf0', borderRadius: '8px' }}></div>
          <span style={{ fontWeight: '900', fontSize: '20px', letterSpacing: '-1px' }}>AURUM <span style={{ color: '#2d8cf0' }}>ADMIN</span></span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                color: pathname === item.path ? '#fff' : 'rgba(255,255,255,0.4)',
                background: pathname === item.path ? 'rgba(45, 140, 240, 0.1)' : 'transparent',
                transition: 'all 0.2s',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.4)',
            padding: '12px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, padding: '60px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
