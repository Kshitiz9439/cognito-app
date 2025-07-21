'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const menuItems = [
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/summarize', label: 'Summarize', icon: FileText },
  { href: '/writer', label: 'Creative Writer', icon: Sparkles },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="flex flex-col gap-2">
      {menuItems.map((item) => {
        const isActive = mounted && pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all duration-200 ease-in-out hover:scale-105 hover:bg-primary/5',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-primary'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
