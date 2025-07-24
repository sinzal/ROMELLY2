
'use client';

import { useState, useEffect, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import emailjs from '@emailjs/browser';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, AlertCircle, CheckCircle, Ticket, MailCheck } from 'lucide-react';
import Image from 'next/image';
import { handleBooking } from '@/app/actions';

interface Package {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  dataAiHint?: string;
  description: string;
}

type FormResult = {
  success: boolean;
  message: string;
  emailSent?: boolean;
};

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.packageId as string;

  const [pkg, setPkg] = useState<Package | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [bookingDate, setBookingDate] = useState<Date>();
  
  const [isPending, startTransition] = useTransition();
  const [formResult, setFormResult] = useState<FormResult | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (packageId) {
      const fetchPackage = async () => {
        setLoading(true);
        setError(null);
        try {
          const docRef = doc(db, 'packages', packageId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setPkg({ id: docSnap.id, ...docSnap.data() } as Package);
          } else {
            setError('Package not found. It might have been removed.');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to load package details. Please try again.');
        }
        setLoading(false);
      };
      fetchPackage();
    }
  }, [packageId]);
  
  const sendBookingConfirmationEmail = async (templateParams: Record<string, unknown>) => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

    try {
      console.log('Attempting to send email with:', { serviceId, templateId, templateParams, publicKey });
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      return true;
    } catch (err) {
      console.error('FAILED...', { 
        status: (err as any)?.status, 
        text: (err as any)?.text,
        error: err 
      });
      return false;
    }
  };


  const handleSubmit = async (formData: FormData) => {
    if (!user || !pkg || !bookingDate) {
      setFormResult({ success: false, message: "Please ensure all fields are filled and you are logged in."});
      return;
    }

    formData.append('packageId', pkg.id);
    formData.append('packageName', pkg.title);
    formData.append('userId', user.uid);
    formData.append('bookingDate', format(bookingDate, 'PPP'));
    
    startTransition(async () => {
        const result = await handleBooking(formData);
        if (result.success) {
            // Get email from form or fallback to user.email
            const email = formData.get('email') as string || user.email;
            if (!email) {
              setFormResult({ success: false, message: "Email address is missing. Cannot send confirmation email." });
              return;
            }
            const templateParams = {
                name: formData.get('name') || user.displayName || 'Valued Customer',
                title: pkg.title,
                to_email: email,
            };
            console.log('templateParams:', JSON.stringify(templateParams, null, 2));
            console.log('name:', templateParams.name);
            console.log('title:', templateParams.title);
            console.log('to_email:', templateParams.to_email);
            const emailSent = await sendBookingConfirmationEmail(templateParams);
            setFormResult({ success: true, message: result.message!, emailSent });
        } else {
            setFormResult({ success: false, message: result.error! });
        }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
         <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Package</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
      </div>
    );
  }
  
  if (!pkg) {
      return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <Card className="max-w-4xl mx-auto shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="relative h-64 md:h-full">
            <Image src={pkg.imageUrl} alt={pkg.title} data-ai-hint={pkg.dataAiHint} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
                <h1 className="text-3xl font-headline font-bold text-white drop-shadow-lg">{pkg.title}</h1>
                <p className="text-2xl font-bold text-primary-foreground/90 mt-1">${pkg.price} / person</p>
            </div>
        </div>

        <div className="p-8">
            <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Ticket className="h-8 w-8 text-primary" />
                    <CardTitle className="text-3xl font-headline">Book Your Tour</CardTitle>
                </div>
                <CardDescription>Complete the form below to reserve your spot on this adventure.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {formResult ? (
                    <Alert variant={formResult.success ? 'default' : 'destructive'} className={formResult.success ? 'border-green-500' : ''}>
                        {formResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        <AlertTitle>{formResult.success ? 'Booking Submitted!' : 'Error'}</AlertTitle>
                        <AlertDescription>
                           {formResult.message}
                        </AlertDescription>
                         {formResult.success && (
                             <>
                                <div className="flex items-center gap-2 mt-4 text-sm">
                                    <MailCheck className={`h-4 w-4 ${formResult.emailSent ? 'text-green-600' : 'text-yellow-600'}`} />
                                    <p>{formResult.emailSent ? 'A confirmation email has been sent.' : 'Could not send confirmation email.'}</p>
                                </div>
                                <Button onClick={() => router.push('/packages')} className="mt-4">Explore More Packages</Button>
                             </>
                        )}
                    </Alert>
                ) : (
                    <form action={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" defaultValue={user?.displayName || ''} required className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" defaultValue={user?.email || ''} required className="mt-1" />
                        </div>
                         <div>
                            <Label htmlFor="guests">Number of Guests</Label>
                            <Input id="guests" name="guests" type="number" min="1" defaultValue="1" required className="mt-1" />
                        </div>
                        <div>
                            <Label>Preferred Booking Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal mt-1",
                                        !bookingDate && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {bookingDate ? format(bookingDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={bookingDate}
                                    onSelect={setBookingDate}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                         <Button type="submit" className="w-full !mt-8 glow-on-hover" disabled={isPending}>
                            {isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                            ) : 'Submit Booking'}
                        </Button>
                    </form>
                )}
            </CardContent>
        </div>
      </Card>
    </div>
  );
}
