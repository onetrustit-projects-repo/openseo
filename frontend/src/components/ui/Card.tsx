'use client';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
}

export function Card({ children, title, style }: CardProps) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', ...style }}>
      {title && <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}><h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{title}</h3></div>}
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}
