import type { Metadata } from 'next';
import { V2DataProvider } from './V2DataContext';
import './v2-globals.css';

export const metadata: Metadata = {
  title: 'It Depends — гайд до AI для дизайнерок',
  description: 'Покроковий гід для переходу з casual у power AI користувачі для DataArt дизайнерок.',
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
            Цей продукт оптимізований для десктопу. Відкрий на комп'ютері для кращого досвіду.
          </div>
        </div>
      </div>

      <V2DataProvider>
        {children}
      </V2DataProvider>
    </div>
  );
}
