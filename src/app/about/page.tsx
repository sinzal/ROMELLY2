
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mountain, Users, HeartHandshake, Target } from 'lucide-react';
import RomelyyLogo from '@/components/RomelyyLogo';

const teamMembers = [
  {
    name: 'Alex Rivera',
    role: 'Founder & CEO',
    imageUrl: 'https://placehold.co/400x400.png',
    dataAiHint: 'professional headshot',
  },
  {
    name: 'Samantha Chen',
    role: 'Head of Operations',
    imageUrl: 'https://placehold.co/400x400.png',
    dataAiHint: 'professional headshot',
  },
  {
    name: 'David Lee',
    role: 'Lead Travel Designer',
    imageUrl: 'https://placehold.co/400x400.png',
    dataAiHint: 'professional headshot',
  },
    {
    name: 'Maria Garcia',
    role: 'Customer Experience Lead',
    imageUrl: 'https://placehold.co/400x400.png',
    dataAiHint: 'professional headshot',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white px-4">
        <Image
          src="https://placehold.co/1920x800.png"
          alt="Group of diverse friends traveling together"
          data-ai-hint="diverse friends traveling"
          fill
          className="object-cover -z-10"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-headline font-bold drop-shadow-2xl">About ROMELYY</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto drop-shadow-lg">Crafting journeys that inspire and memories that last a lifetime.</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="prose prose-lg max-w-none">
                <h2 className="text-4xl font-headline font-bold text-primary">Our Story</h2>
                <p>
                    ROMELYY was born from a simple, yet powerful idea: travel should be more than just a trip; it should be a transformative experience. Founded by a group of passionate explorers, we set out to create a travel company that puts authenticity, connection, and unforgettable moments at the heart of everything we do.
                </p>
                <p>
                    We believe that the best way to see the world is through the eyes of those who know it best. That's why we partner with expert local guides who share our passion for discovery and our commitment to responsible travel. From bustling cityscapes to serene natural wonders, we design journeys that go beyond the surface, allowing you to connect with the culture, the people, and the spirit of each destination.
                </p>
            </div>
             <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image src="https://placehold.co/600x800.png" alt="Traveler looking at a map" data-ai-hint="traveler map" fill className="object-cover" />
             </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-20 sm:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Core Values</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    The principles that guide our every journey.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <Card className="text-center p-6 border-0 shadow-lg hover:shadow-primary/20 transition-shadow">
                     <CardHeader>
                        <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                           <Target className="h-10 w-10" />
                        </div>
                        <CardTitle className="font-headline text-2xl">Our Mission</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-muted-foreground">To create authentic and immersive travel experiences that connect people, cultures, and the planet.</p>
                     </CardContent>
                 </Card>
                 <Card className="text-center p-6 border-0 shadow-lg hover:shadow-primary/20 transition-shadow">
                     <CardHeader>
                        <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                           <Mountain className="h-10 w-10" />
                        </div>
                        <CardTitle className="font-headline text-2xl">Embrace Adventure</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-muted-foreground">We encourage curiosity and a spirit of exploration, seeking out new paths and hidden gems.</p>
                     </CardContent>
                 </Card>
                 <Card className="text-center p-6 border-0 shadow-lg hover:shadow-primary/20 transition-shadow">
                     <CardHeader>
                        <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                           <HeartHandshake className="h-10 w-10" />
                        </div>
                        <CardTitle className="font-headline text-2xl">Travel Responsibly</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-muted-foreground">We are committed to sustainable practices that respect local communities and protect the environment.</p>
                     </CardContent>
                 </Card>
            </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">Meet Our Team</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate experts behind your next great adventure.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative h-40 w-40 md:h-48 md:w-48 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                  <Image src={member.imageUrl} alt={`Headshot of ${member.name}`} data-ai-hint={member.dataAiHint} fill className="object-cover" />
                </div>
                <h3 className="text-xl font-bold font-headline">{member.name}</h3>
                <p className="text-primary">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* Join Us Section */}
      <section className="bg-primary text-primary-foreground">
         <div className="container mx-auto px-4 py-20 text-center">
            <h2 className="text-4xl font-headline font-bold">Ready for Your Next Adventure?</h2>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Let's explore the world together. Browse our curated packages or get in touch to plan your custom journey.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                 <button className="bg-primary-foreground text-primary font-bold py-3 px-8 rounded-full hover:bg-primary-foreground/90 transition-colors">
                    Explore Packages
                 </button>
                 <button className="border-2 border-primary-foreground py-3 px-8 rounded-full hover:bg-primary-foreground/10 transition-colors">
                    Contact Us
                 </button>
            </div>
         </div>
      </section>
    </div>
  );
}
