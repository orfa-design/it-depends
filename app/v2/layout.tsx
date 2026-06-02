import type { Metadata } from 'next';
import { V2DataProvider } from './V2DataContext';
import './v2-globals.css';

export const metadata: Metadata = {
  title: 'It Depends — AI guide for designers',
  description: 'A step-by-step guide for DataArt designers moving from casual to power AI users.',
};

export default function V2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="v2-body-wrapper">
      {/* Cyrillic-friendly Google Fonts import */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Geologica:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap" 
        rel="stylesheet" 
      />
      
      {/* Mobile warning overlay enforcer */}
      <div className="mobile-warning-overlay" style={{ display: 'none' }}>
        <div className="mw-box">
          <div className="mw-icon">💻</div>
          <div className="mw-text">
            This product is optimised for desktop. Open it on a computer for the best experience.
          </div>
        </div>
      </div>

      <V2DataProvider>
        {children}
      </V2DataProvider>
    </div>
  );
}
