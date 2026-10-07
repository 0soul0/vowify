import React from 'react';

export function DashboardPageModule() {
    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>儀表板</h1>
                <p style={{ color: '#666' }}>這是從 packages/feature-dashboard 獨立載入的完整頁面模組</p>
            </header>

            <main>
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                    <p>載入資料中...</p>
                </div>
            </main>
        </div>
    );
}