import React from 'react';
interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  darkMode?: boolean;
  jungleMode?: boolean;
}
const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'medium',
  showText = true,
  darkMode = false,
  jungleMode = false
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'h-6 w-6';
      case 'large':
        return 'h-12 w-12';
      case 'medium':
      default:
        return 'h-8 w-8';
    }
  };
  // Get text color based on theme
  const getTextColorClass = () => {
    if (jungleMode) return 'text-green-400';
    if (darkMode) return 'text-blue-400';
    return 'text-emerald-700';
  };
  return <div className={`flex items-center ${className}`}>
      <div className={`relative ${getSizeClass()}`}>
        <img src="/88187f6d-1595-4217-9cae-5afae6ad0657.jpg" alt="WICUE Logo" className={`${getSizeClass()} object-contain rounded-full`} style={{
        backgroundColor: 'transparent'
      }} />
      </div>
      {showText && <span className={`ml-2 font-bold ${getTextColorClass()}`}>WICUE</span>}
    </div>;
};
export default Logo;