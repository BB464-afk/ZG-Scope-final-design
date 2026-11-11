import React, { useState } from 'react';
import logoWhiteFull from 'figma:asset/ZGP_Logo_neg.png';
import logoWhiteFullSVG from '../../imports/ZGP_Logo_neg.svg';
import logoOrangeFullSVG from '../../imports/ZGP_Logo_vivid_orange.svg';
import logoIconOrangeSVG from '../../imports/ZGP_Signet_vivid_orange.svg';
import logoIconWhiteSVG from '../../imports/ZGP_Signet_neg.svg';

/**
 * Production-safe Logo component
 * Uses actual logo files with SVG fallbacks
 */

interface LogoProps {
  variant: 'whiteFull' | 'orangeFull' | 'iconOrange' | 'iconWhite';
  alt?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  className?: string;
}

// SVG Fallback Components (only used if images fail to load)
const OrangeFullLogoSVG = ({ style, className }: { style?: React.CSSProperties; className?: string }) => (
  <svg 
    viewBox="0 0 200 50" 
    style={{ height: '48px', width: 'auto', ...style }}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* ZG Icon */}
    <rect x="0" y="0" width="50" height="50" fill="#FD4314" rx="4"/>
    <text x="25" y="32" fontSize="24" fontWeight="700" fill="white" textAnchor="middle" fontFamily="system-ui">ZG</text>
    
    {/* Company Name */}
    <text x="60" y="22" fontSize="16" fontWeight="700" fill="#1F2937" fontFamily="system-ui">ZAUNER</text>
    <text x="60" y="38" fontSize="12" fontWeight="500" fill="#6B7280" fontFamily="system-ui">GROUP</text>
  </svg>
);

const WhiteFullLogoSVG = ({ style, className }: { style?: React.CSSProperties; className?: string }) => (
  <svg 
    viewBox="0 0 200 50" 
    style={{ height: '48px', width: 'auto', ...style }}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* ZG Icon */}
    <rect x="0" y="0" width="50" height="50" fill="white" rx="4"/>
    <text x="25" y="32" fontSize="24" fontWeight="700" fill="#FD4314" textAnchor="middle" fontFamily="system-ui">ZG</text>
    
    {/* Company Name */}
    <text x="60" y="22" fontSize="16" fontWeight="700" fill="white" fontFamily="system-ui">ZAUNER</text>
    <text x="60" y="38" fontSize="12" fontWeight="500" fill="rgba(255,255,255,0.7)" fontFamily="system-ui">GROUP</text>
  </svg>
);

const IconOnlyLogoSVG = ({ style, className }: { style?: React.CSSProperties; className?: string }) => (
  <svg 
    viewBox="0 0 40 40" 
    style={{ height: '32px', width: '32px', ...style }}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0" y="0" width="40" height="40" fill="#FD4314" rx="4"/>
    <text x="20" y="27" fontSize="20" fontWeight="700" fill="white" textAnchor="middle" fontFamily="system-ui">ZG</text>
  </svg>
);

const IconWhiteLogoSVG = ({ style, className }: { style?: React.CSSProperties; className?: string }) => (
  <svg 
    viewBox="0 0 40 40" 
    style={{ height: '32px', width: '32px', ...style }}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0" y="0" width="40" height="40" fill="white" rx="4"/>
    <text x="20" y="27" fontSize="20" fontWeight="700" fill="#FD4314" textAnchor="middle" fontFamily="system-ui">ZG</text>
  </svg>
);

export const Logo: React.FC<LogoProps> = ({ 
  variant, 
  alt = 'Zauner Group', 
  style = {}, 
  onClick,
  className 
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    console.error('Failed to load logo:', variant);
  };

  // If image fails to load, show SVG fallback
  if (imageError) {
    switch (variant) {
      case 'whiteFull':
        return <WhiteFullLogoSVG style={style} className={className} />;
      case 'orangeFull':
        return <OrangeFullLogoSVG style={style} className={className} />;
      case 'iconOrange':
        return <IconOnlyLogoSVG style={style} className={className} />;
      case 'iconWhite':
        return <IconWhiteLogoSVG style={style} className={className} />;
      default:
        return <OrangeFullLogoSVG style={style} className={className} />;
    }
  }

  // Render actual logo images
  const logoSrc = variant === 'whiteFull' ? logoWhiteFullSVG : 
                  variant === 'orangeFull' ? logoOrangeFullSVG : 
                  variant === 'iconOrange' ? logoIconOrangeSVG : 
                  logoIconWhiteSVG;

  return (
    <img 
      src={logoSrc}
      alt={alt}
      style={style}
      onClick={onClick}
      className={className}
      onError={handleImageError}
    />
  );
};

// Convenience exports for common logo usage patterns
export const WhiteFullLogo: React.FC<Omit<LogoProps, 'variant'>> = (props) => (
  <Logo variant="whiteFull" {...props} />
);

export const OrangeFullLogo: React.FC<Omit<LogoProps, 'variant'>> = (props) => (
  <Logo variant="orangeFull" {...props} />
);

export const IconOnlyLogo: React.FC<Omit<LogoProps, 'variant'>> = (props) => (
  <Logo variant="iconOrange" {...props} />
);

export const IconWhiteLogo: React.FC<Omit<LogoProps, 'variant'>> = (props) => (
  <Logo variant="iconWhite" {...props} />
);

export default Logo;