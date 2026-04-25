'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from '@/app/finance.module.css';
import { Layout, Users, Zap, Sparkles, Settings } from 'lucide-react';

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

  return (
    <div className={styles.adminWrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>A</div>
          <span>AURUM <span>ADMIN</span></span>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navItem}>
            <Layout className={styles.navIcon} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/affiliates" className={styles.navItem}>
            <Users className={styles.navIcon} />
            <span>Affiliates</span>
          </Link>
          <Link href="/admin/manage" className={styles.navItem}>
            <Zap className={styles.navIcon} />
            <span>Campaigns & Rotator</span>
          </Link>
          <Link href="/admin/builder" className={styles.navItem}>
            <Sparkles className={styles.navIcon} style={{ color: '#d4af37' }} />
            <span style={{ color: '#d4af37', fontWeight: 'bold' }}>Project Architect</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userBadge}>
            <div className={styles.userAvatar}>JD</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>James Doe</span>
              <span className={styles.userRole}>System Architect</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
