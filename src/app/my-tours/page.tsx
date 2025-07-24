
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { app, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

import PackageCard from '@/components/PackageCard';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, PackageSearch } from 'lucide-react';

interface Package {
  id: string;
  imageUrl: string;
  dataAiHint?: string;
  title: string;
  description: string;
  price: number;
  guideName?: string;
  duration?: string;
}

export default function MyToursPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);
  
  const [user, setUser] = useState<User | null>(null);
  const [myPackages, setMyPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch packages created by this user
        try {
          const packagesCollection = collection(db, 'packages');
          const packagesQuery = query(
              packagesCollection, 
              where('guideId', '==', currentUser.uid)
          );
          const querySnapshot = await getDocs(packagesQuery);
          const packagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
          setMyPackages(packagesData);
        } catch (error: any) {
          console.error("Error fetching user's packages: ", error);
          let description = "Could not load your packages. Please try again later.";
          if (error.message.includes("indexes?create_composite")) {
            const firebaseUrl = error.message.split(' ').find((s: string) => s.startsWith('https'));
            description = `Your query requires a database index. Please create it in Firebase and then refresh the page. URL: ${firebaseUrl}`;
          }
          toast({
              variant: "destructive",
              title: "Error fetching packages",
              description,
          })
        }
      } else {
        // Not logged in, redirect to login
        toast({
            title: "Please Log In",
            description: "You need to be logged in to view your tours.",
        });
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">My Tours</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                        Here are all the amazing adventures you've created.
                    </p>
                </div>
                <Button asChild size="lg" className="glow-on-hover">
                    <Link href="/dashboard"><PlusCircle className="mr-2" />Add New Package</Link>
                </Button>
            </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {myPackages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {myPackages.map((pkg) => (
                <PackageCard key={pkg.id} {...pkg} />
            ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-secondary/30 rounded-lg flex flex-col items-center gap-6">
                 <PackageSearch className="h-20 w-20 text-muted-foreground" />
                <h3 className="text-2xl font-bold font-headline">No Packages Yet!</h3>
                <p className="text-muted-foreground mt-2 max-w-md">You haven't created any packages. Click the button below to add your first one and share it with the world!</p>
                <Button asChild className="mt-4">
                     <Link href="/dashboard"><PlusCircle className="mr-2 h-4 w-4" /> Add Your First Package</Link>
                 </Button>
            </div>
        )}
      </div>
    </div>
  );
}
