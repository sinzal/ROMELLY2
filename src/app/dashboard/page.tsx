
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore, doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { app, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PackagePlus } from 'lucide-react';

const packageSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  place: z.string().min(3, 'Place is required.'),
  hotel: z.string().min(3, 'Hotel name is required.'),
  transport: z.string().min(3, 'Transport details are required.'),
  duration: z.string().min(3, 'Duration is required.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  imageUrl: z.string().url('Please enter a valid image URL.'),
});

type PackageFormValues = z.infer<typeof packageSchema>;

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
        title: '',
        place: '',
        hotel: '',
        transport: '',
        duration: '',
        description: '',
        price: 0,
        imageUrl: 'https://placehold.co/600x400.png',
    },
  });

  async function onSubmit(values: PackageFormValues) {
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You are not logged in." });
        return;
    }

    try {
        const docRef = await addDoc(collection(db, "packages"), {
            ...values,
            guideId: user.uid,
            guideName: user.displayName,
            createdAt: serverTimestamp(),
        });
        toast({
            title: "Package Added!",
            description: "Your new travel package has been successfully created.",
        });
        form.reset();
        router.push('/my-tours');
    } catch (error: any) {
        console.error("Error adding package: ", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem saving your package. Please try again.",
        });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
              <PackagePlus className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Add a New Package</CardTitle>
          <CardDescription>Fill out the details below to create a new travel package for your clients.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Package Title</FormLabel>
                            <FormControl><Input placeholder="e.g., Enchanting Paris Escape" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="place" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Place / City</FormLabel>
                            <FormControl><Input placeholder="e.g., Paris" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="hotel" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hotel</FormLabel>
                            <FormControl><Input placeholder="e.g., The Ritz Carlton" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="transport" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transport</FormLabel>
                            <FormControl><Input placeholder="e.g., Private Car, Metro Pass" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                 <FormField control={form.control} name="duration" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl><Input placeholder="e.g., 7 Days, 6 Nights" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe the amazing experience..." {...field} rows={5} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl><Input type="number" placeholder="1200" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl><Input placeholder="https://placehold.co/600x400.png" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
              <Button type="submit" className="w-full !mt-8 glow-on-hover" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Package...</> : 'Add Package'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
