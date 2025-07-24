
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { UserCircle, Clock, Hotel, Plane, X } from 'lucide-react';
import { Separator } from './ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from './ui/scroll-area';

type PackageCardProps = {
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
};

export default function PackageCard({ id, imageUrl, dataAiHint, title, description, price, guideName, duration, hotel, transport }: PackageCardProps) {
  return (
    <Dialog>
      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col group">
        <div className="relative h-56 w-full">
          <Image src={imageUrl} alt={title} data-ai-hint={dataAiHint} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
              {guideName && (
                  <div className="flex items-center gap-2 text-xs text-primary-foreground/90 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                      <UserCircle className="h-4 w-4" />
                      <span>By {guideName}</span>
                  </div>
              )}
          </div>
        </div>
        <CardContent className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold font-headline mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground flex-grow mb-4">{description.substring(0, 100)}{description.length > 100 && '...'}</p>
          
          <div className="space-y-3 text-sm text-muted-foreground mb-4">
              {duration && (
                  <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-primary/80" />
                      <span>{duration}</span>
                  </div>
              )}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center mt-auto">
            <p className="text-2xl font-bold text-primary">${price}</p>
            <DialogTrigger asChild>
                <Button size="sm" className="glow-on-hover">View Details</Button>
            </DialogTrigger>
          </div>
        </CardContent>
      </Card>

      <DialogContent className="sm:max-w-[600px] p-0">
        <ScrollArea className="max-h-[90vh]">
            <div className="relative h-64 w-full">
                <Image src={imageUrl} alt={title} data-ai-hint={dataAiHint} fill className="object-cover rounded-t-lg" />
            </div>
            <DialogHeader className="p-6 text-left">
            <DialogTitle className="text-3xl font-headline">{title}</DialogTitle>
            {guideName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                        <UserCircle className="h-4 w-4" />
                        <span>Tour by {guideName}</span>
                    </div>
                )}
            </DialogHeader>
            <div className="px-6 pb-6 space-y-6">
                <DialogDescription className="text-base text-foreground leading-relaxed">
                    {description}
                </DialogDescription>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                            <p className="font-semibold">Duration</p>
                            <p className="text-muted-foreground">{duration || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Hotel className="h-5 w-5 text-primary" />
                        <div>
                            <p className="font-semibold">Hotel</p>
                            <p className="text-muted-foreground">{hotel || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Plane className="h-5 w-5 text-primary" />
                        <div>
                            <p className="font-semibold">Transport</p>
                            <p className="text-muted-foreground">{transport || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                    <p className="text-3xl font-bold text-primary">${price}<span className="text-sm font-normal text-muted-foreground">/person</span></p>
                    <Button size="lg" className="glow-on-hover" asChild>
                    <Link href={`/book/${id}`}>Book Now</Link>
                    </Button>
                </div>
            </div>
         </ScrollArea>
         <DialogClose asChild>
            <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-white/50 hover:bg-white/80 p-1">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
            </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
