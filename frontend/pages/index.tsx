import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Calendar, Heart } from 'lucide-react';
import { bookAPI } from '@/lib/api';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalBorrowers: 0,
    activeLoans: 0,
    favoriteBooks: 0,
  });

  useEffect(() => {
    // Test API connection
    const testConnection = async () => {
      try {
        await bookAPI.getBooks();
        setIsConnected(true);
      } catch (error) {
        console.warn('Backend not connected:', error);
        setIsConnected(false);
      }
    };

    testConnection();
  }, []);

  return (
    <>
      <Head>
        <title>ছোটপাতা পাঠাগার</title>
        <meta name="description" content="ছোটপাতা পাঠাগার - একটি পাঠাগার ম্যানেজমেন্ট সিস্টেম" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-background">
        <main className="container mx-auto p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              ছোটপাতা পাঠাগার
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              একটি পাঠাগার ম্যানেজমেন্ট সিস্টেম
            </p>
            
            {/* Connection Status */}
            <div className="flex justify-center mb-8">
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "✅ Backend Connected" : "❌ Backend Disconnected"}
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBooks}</div>
                <p className="text-xs text-muted-foreground">Books in collection</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Borrowers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBorrowers}</div>
                <p className="text-xs text-muted-foreground">Registered borrowers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeLoans}</div>
                <p className="text-xs text-muted-foreground">Currently borrowed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.favoriteBooks}</div>
                <p className="text-xs text-muted-foreground">Favorite books</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="min-w-[200px]">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Books
              </Button>
              <Button variant="outline" size="lg" className="min-w-[200px]">
                <Users className="mr-2 h-4 w-4" />
                Manage Borrowers
              </Button>
              <Button variant="outline" size="lg" className="min-w-[200px]">
                <Calendar className="mr-2 h-4 w-4" />
                Lending Records
              </Button>
            </div>
          </div>

          {/* Status Message */}
          {!isConnected && (
            <div className="mt-12 text-center">
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <p className="text-destructive">
                    Backend API is not running. Start the backend server to enable full functionality.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Run: <code className="bg-muted px-2 py-1 rounded">uvicorn src.main_fastapi:app --reload --host 0.0.0.0 --port 8000</code>
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
