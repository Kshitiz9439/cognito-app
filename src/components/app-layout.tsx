'use client';

import Link from 'next/link';
import { Bot } from 'lucide-react';
import { SidebarNav } from './sidebar-nav';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 flex-shrink-0 flex-col bg-white p-4 text-foreground hidden md:flex border-r border-gray-200">
        <div className="flex flex-col h-full">
            <div className="px-2 pb-4 mb-4 border-b border-gray-200">
                 <Link href="/chat" className="flex items-center gap-2 font-bold text-lg text-slate-800">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <span>Cognito</span>
                 </Link>
            </div>
            <SidebarNav />
        </div>
      </aside>
      <main className="flex-1 bg-background">
        {children}
      </main>
    </div>
  );
}
