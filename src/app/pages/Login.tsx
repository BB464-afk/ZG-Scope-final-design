import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { OrangeFullLogo } from '../components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to main app (My Projects)
    navigate('/app');
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#FAFAFA',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      {/* Login Card */}
      <div style={{
        width: '440px',
        maxWidth: '100%',
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '8px',
        padding: '32px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <OrangeFullLogo 
            style={{ 
              height: '48px',
              width: 'auto',
              objectFit: 'contain'
            }} 
          />
        </div>

        {/* Title Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#272721',
            margin: '0 0 8px 0'
          }}>
            ZG-CMP Login
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#5F6B7A',
            margin: '0'
          }}>
            Scheduling, Construction, Progress & Execution
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@zaunergroup.com"
              required
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                fontSize: '14px',
                color: '#272721',
                backgroundColor: '#FFFFFF',
                border: '1px solid #C8D9EE',
                borderRadius: '4px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#FD4314'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#C8D9EE'}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 40px 0 12px',
                  fontSize: '14px',
                  color: '#272721',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #C8D9EE',
                  borderRadius: '4px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#FD4314'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#C8D9EE'}
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
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#5F6B7A'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '24px'
          }}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                fontSize: '13px',
                color: '#FD4314',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              height: '44px',
              backgroundColor: '#FD4314',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E03D12'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '24px',
        fontSize: '13px',
        color: '#9CA3AF',
        textAlign: 'center'
      }}>
        © 2026 Zauner Group
      </div>
    </div>
  );
}