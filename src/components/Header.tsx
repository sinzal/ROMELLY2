
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { app, db } from '@/lib/firebase';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import RomelyyLogo from './RomelyyLogo';
import { PlusCircle, LogOut, User as UserIcon, Loader2, ListOrdered } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              setUserRole(userDoc.data().role);
            } else {
              setUserRole(null); 
            }
        } catch (error) {
            console.error("Error fetching user role", error);
            setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/login');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Logout Failed', description: 'Could not log you out. Please try again.' });
    }
  };


  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 text-3xl font-bold font-headline text-gray-800">
            <RomelyyLogo className="h-10 w-10" />
            <span className="mt-1">ROMELYY</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">Home</Link>
            <Link href="/packages" className="text-foreground/80 hover:text-primary transition-colors font-medium">Explore Packages</Link>
            <Link href="/my-tours" className="text-foreground/80 hover:text-primary transition-colors font-medium">My Tours</Link>
            <Link href="/about" className="text-foreground/80 hover:text-primary transition-colors font-medium">About Us</Link>
            <Link href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
             {loading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : user ? (
              <>
                {userRole === 'tour_guide' && (
                     <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard"><PlusCircle className="mr-2 h-4 w-4" /> Add Package</Link>
                      </Button>
                )}
                <div className="flex items-center gap-2 border-l pl-2 ml-2">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground hidden sm:inline">Hi, {user.displayName}</span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Log Out</Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild className="glow-on-hover">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
