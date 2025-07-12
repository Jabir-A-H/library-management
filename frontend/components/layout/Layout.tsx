import { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Home, 
  Settings, 
  Menu,
  X,
  Github,
  Heart
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Books', href: '/books', icon: BookOpen },
  { name: 'Borrowers', href: '/borrowers', icon: Users },
  { name: 'Lending', href: '/lending', icon: Calendar },
];

export default function Layout({ children, title = 'ছোটপাতা পাঠাগার', description = 'একটি পাঠাগার ম্যানেজমেন্ট সিস্টেম' }: LayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="ছোটপাতা পাঠাগার" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      
      <div className="min-h-screen bg-background">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-lg font-bold">ছোটপাতা পাঠাগার</h1>
                  <p className="text-xs text-muted-foreground">Personal Library</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = router.pathname === item.href || 
                                (item.href !== '/' && router.pathname.startsWith(item.href));
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
            
            {/* Footer */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  v1.0.0
                </Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <a 
                      href="https://github.com/Jabir-A-H/library-management" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1"
                      title="View source code on GitHub"
                      aria-label="View source code on GitHub"
                    >
                      <Github className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Heart className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b lg:hidden">
            <div className="flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <Link href="/">
                <h1 className="text-lg font-bold">ছোটপাতা পাঠাগার</h1>
              </Link>
              <div className="w-8" /> {/* Spacer */}
            </div>
          </div>
          
          {/* Page content */}
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
