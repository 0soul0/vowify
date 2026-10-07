import React from 'react';

interface SectionCardProps {
  title: string;
  description: string;
  icon?: string;
  children?: React.ReactNode;
}

export function SectionCard({
  title,
  description,
  icon = '📦',
  children,
}: SectionCardProps) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      <div style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
      <h3
        style={{
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: 600,
          color: '#111827',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: '0 0 16px 0',
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
      {children}
    </div>
  );
}
