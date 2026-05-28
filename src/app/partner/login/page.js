'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/admin/admin.module.css';

export default function PartnerLogin() {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [affiliateCode, setAffiliateCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const res = await fetch('/api/partner/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, password, affiliateCode })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        router.push('/partner/dashboard');
      } else {
        const res = await fetch('/api/partner/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Login failed');
        }

        router.push('/partner/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
      padding: '20px',
      color: '#fff',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/images/aurum_logo.png" 
            alt="Aurum Rise Logo" 
            style={{ width: '100%', maxWidth: '240px', height: 'auto' }}
          />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>
          {isRegister ? 'Partner Registration' : 'Partner Command'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>
          {isRegister 
            ? 'Create a new affiliate account to start managing your funnels and traffic.'
            : 'Enter your affiliate credentials to manage your funnels and traffic.'}
        </p>

        {error && (
          <div style={{
            background: 'rgba(255, 75, 75, 0.1)',
            border: '1px solid rgba(255, 75, 75, 0.2)',
            color: '#ff4b4b',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isRegister && (
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
            </div>
          )}

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '14px 40px 14px 16px',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {isRegister && (
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                Affiliate Code <span style={{ textTransform: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>(Optional)</span>
              </label>
              <input
                type="text"
                value={affiliateCode}
                onChange={(e) => setAffiliateCode(e.target.value)}
                placeholder="E.g., MYCODE"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px', display: 'block', lineHeight: '1.4' }}>
                Leave blank to have a unique 6-character code generated for you.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#00ff88',
              color: '#000',
              fontWeight: '800',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 255, 136, 0.2)',
              marginTop: '12px',
              transition: 'all 0.2s'
            }}
          >
            {loading ? (isRegister ? 'Registering...' : 'Authenticating...') : (isRegister ? 'Register Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#00ff88',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {isRegister ? 'Already have a partner account? Sign In' : "Don't have a partner account? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
}
