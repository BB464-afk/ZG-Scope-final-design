import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F7F9FC'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '400px',
        padding: '32px'
      }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '16px'
        }}>404</h1>
        <p style={{
          fontSize: '18px',
          color: '#5F6B7A',
          marginBottom: '32px'
        }}>
          Page not found
        </p>
        <button
          onClick={() => navigate('/app')}
          style={{
            height: '40px',
            padding: '0 24px',
            backgroundColor: '#FD4314',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
