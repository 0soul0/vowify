import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Calendar, Copy, ExternalLink, Heart } from 'lucide-react';

interface Invitation {
    id: string;
    title: string;
    status: '已發布' | '草稿';
    date: string;
    url: string;
    coverImage: string;
}

const invitations: Invitation[] = [
    {
        id: '1',
        title: 'Ethan & Olivia 婚禮喜帖',
        status: '已發布',
        date: '2025.10.18',
        url: 'loveinvite.com/ethan-olivia',
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: '2',
        title: '春日訂婚宴邀請函',
        status: '草稿',
        date: '2026.03.21',
        url: 'loveinvite.com/ethan-olivia',
        coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    },
];

export function InvitationDashboard() {

    return (
        <div>
            <h1>InvitationDashboard</h1>
        </div>
    );
}