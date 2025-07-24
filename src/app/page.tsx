
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, ShieldCheck, Smile, Loader2, PlusCircle } from 'lucide-react';
import PackageCard from '@/components/PackageCard';
import SuggestDestinations from '@/components/SuggestDestinations';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { app, db } from '@/lib/firebase';


const valueProps = [
  {
    icon: Award,
    title: 'Expert-Curated Adventures',
    description: 'Every tour is meticulously planned by our travel experts to ensure you get the most out of your adventure.',
    color: 'text-rose-500 bg-rose-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Safety and Trust',
    description: 'Your safety is our priority. We partner with trusted local guides and ensure all experiences are vetted.',
    color: 'text-cyan-500 bg-cyan-500/10',
  },
  {
    icon: Smile,
    title: 'Unforgettable Experiences',
    description: 'We focus on the details that create lasting memories, from hidden gems to seamless travel logistics.',
    color: 'text-amber-500 bg-amber-500/10',
  },
];

const fallbackPackages: Package[] = [
  {
    id: '1',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX2xcGFjisKN8ip2ydNaRQKJX9abaLpAJnFw&s',
    dataAiHint: 'italy amalfi coast',
    title: 'Amalfi Coast Paradise',
    description: 'Discover the stunning cliffs, sparkling waters, and charming villages of Italy\'s Amalfi Coast.',
    price: 1800,
    guideName: 'Marco Rossi',
    duration: '8 Days, 7 Nights',
    hotel: 'Hotel Santa Caterina',
    transport: 'Private Car & Ferry',
  },
  {
    id: '2',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5DP3ic9FONxSgZW7JF4OgsC4Ytw8Db8tYfQ&s',
    dataAiHint: 'kyoto japan temple',
    title: 'Mystical Kyoto Journey',
    description: 'Immerse yourself in the ancient temples, serene gardens, and rich traditions of Kyoto, Japan.',
    price: 2500,
    guideName: 'Yuki Tanaka',
    duration: '10 Days, 9 Nights',
    hotel: 'Tawaraya Ryokan',
    transport: 'Shinkansen & Local Metro',
  },
  {
    id: '3',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_uc0uW_2I-YEBZYfIo5GaRlwWggJyhzw7qA&s',
    dataAiHint: 'patagonia landscape',
    title: 'Patagonia Wilderness Trek',
    description: 'Embark on an epic adventure through the rugged, breathtaking landscapes of Patagonia.',
    price: 3200,
    guideName: 'Sofia Diaz',
    duration: '12 Days, 11 Nights',
    hotel: 'Explora Patagonia',
    transport: '4x4 Vehicle & Hiking',
  },
];


interface Package {
  id: string;
  imageUrl: string;
  dataAiHint?: string;
  title: string;
  description: string;
  price: number;
  guideName?: string;
  duration?: string;
  hotel?: string;
  transport?: string;
}

export default function Home() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoadingUser(true);
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
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoadingPackages(true);
      try {
        const packagesCollection = collection(db, 'packages');
        const packagesQuery = query(packagesCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(packagesQuery);
        const packagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package)).slice(0, 3);
        
        if (packagesData.length > 0) {
            setPackages(packagesData);
        } else {
            setPackages(fallbackPackages);
        }
      } catch (error) {
        console.error("Error fetching packages: ", error);
        setPackages(fallbackPackages);
      }
      setLoadingPackages(false);
    };
    fetchPackages();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative text-white py-40 sm:py-56">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        <Image
          src="https://www.celebritycruises.com/blog/content/uploads/2022/01/most-beautiful-mountains-in-the-world-kirkjufell-iceland-1024x580.jpg"
          data-ai-hint="mountains river"
          alt="Breathtaking travel landscape with mountains and a river"
          fill
          className="object-cover -z-10"
          priority
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4 drop-shadow-2xl">
            Your Next Adventure Awaits
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto drop-shadow-lg">
            Discover unforgettable travel experiences with ROMELYY. We craft unique tours that turn your dream vacation into a reality.
          </p>
          <Button size="lg" className="text-lg glow-on-hover transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-primary to-accent/80 hover:from-primary/90 hover:to-accent/70 text-white" asChild>
             <Link href="/packages">Explore Tours</Link>
          </Button>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">Why Choose ROMELYY?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We are dedicated to providing the best travel experiences, tailored just for you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((prop) => (
              <Card key={prop.title} className="text-center shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary/20 bg-card/50">
                <CardHeader>
                  <div className={`mx-auto rounded-full p-4 w-fit ${prop.color}`}>
                    <prop.icon className="h-10 w-10" />
                  </div>
                  <CardTitle className="mt-4 font-headline text-2xl">{prop.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{prop.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4">
          
          {!loadingUser && userRole === 'tour_guide' && (
              <div className="text-center mb-16 bg-primary/5 p-8 rounded-2xl">
                  <h2 className="text-2xl font-headline font-bold">Tour Guide Dashboard</h2>
                  <p className="mt-2 text-muted-foreground">You have the power to create new adventures.</p>
                  <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90 glow-on-hover">
                      <Link href="/dashboard"><PlusCircle className="mr-2 h-4 w-4" /> Add a New Package</Link>
                  </Button>
              </div>
          )}

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Recent Adventures</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked destinations that promise an unforgettable journey. New packages are added all the time!
            </p>
          </div>
          {loadingPackages ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} {...pkg} />
              ))}
            </div>
          ) : (
             <div className="text-center py-16 bg-secondary/30 rounded-lg">
                <h3 className="text-xl font-bold font-headline">No Featured Packages Yet</h3>
                <p className="text-muted-foreground mt-2">Check back soon for amazing new adventures!</p>
              </div>
          )}
        </div>
      </section>

      {/* Suggest Destinations Section */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">Discover New Horizons</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Unsure where to go next? Let our AI suggest destinations based on a region you're interested in.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-4 sm:p-8 rounded-2xl">
            <SuggestDestinations />
          </div>
        </div>
      </section>
    </div>
  );
}
