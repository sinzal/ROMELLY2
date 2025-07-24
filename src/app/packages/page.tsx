
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PackageCard from '@/components/PackageCard';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';

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

const MAX_PRICE = 5000;

export default function ExplorePackagesPage() {
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);

  useEffect(() => {
    const fetchPackages = async () => {
        setLoading(true);
        try {
            const packagesCollection = collection(db, 'packages');
            const packagesQuery = query(packagesCollection, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(packagesQuery);
            const packagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
            setAllPackages(packagesData);
            setFilteredPackages(packagesData);
        } catch (error) {
            console.error("Error fetching packages: ", error);
        }
        setLoading(false);
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let packages = allPackages;

      // Filter by search term
      if (searchTerm) {
        packages = packages.filter(pkg =>
          pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by price range
      packages = packages.filter(pkg =>
        pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
      );

      setFilteredPackages(packages);
    };

    // Debounce the filter application
    const handler = setTimeout(() => {
        applyFilters();
    }, 300);

    return () => {
        clearTimeout(handler);
    };
  }, [searchTerm, priceRange, allPackages]);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/10 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Explore Our Packages</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find your next perfect adventure. Search by destination or filter by your preferences.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                        id="search"
                        type="text"
                        placeholder="e.g., Bali, Tokyo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Price Range</label>
                    <Slider
                        min={0}
                        max={MAX_PRICE}
                        step={100}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Packages Grid */}
          <main className="lg:col-span-3">
             {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
             ) : filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} {...pkg} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-secondary/30 rounded-lg">
                <h3 className="text-2xl font-bold font-headline">No Packages Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filters, or be the first to add a package!</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
