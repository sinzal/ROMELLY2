'use server';

import { suggestDestinations } from '@/ai/flows/suggest-destinations';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export async function handleSuggestDestinations(region: string) {
  if (!region) {
    return { success: false, error: 'Region cannot be empty.' };
  }

  try {
    const result = await suggestDestinations({ region });
    if (result && result.destinations) {
        return { success: true, data: result.destinations };
    } else {
        return { success: false, error: 'Could not generate suggestions. The model returned an unexpected response.' };
    }
  } catch (e) {
    console.error(e);
    return { success: false, error: 'An unexpected error occurred while suggesting destinations.' };
  }
}

export async function handleBooking(formData: FormData) {
    const rawFormData = {
        packageId: formData.get('packageId') as string,
        packageName: formData.get('packageName') as string,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        guests: formData.get('guests') as string,
        bookingDate: formData.get('bookingDate') as string,
        userId: formData.get('userId') as string,
    };

    // Basic validation
    if (!rawFormData.name || !rawFormData.email || !rawFormData.guests || !rawFormData.bookingDate || !rawFormData.packageId || !rawFormData.userId) {
        return { success: false, error: 'Please fill out all fields.' };
    }

    try {
        await addDoc(collection(db, 'bookings'), {
            ...rawFormData,
            guests: parseInt(rawFormData.guests, 10),
            createdAt: serverTimestamp(),
            status: 'pending',
        });
        return { success: true, message: 'Booking submitted successfully! We will contact you shortly.' };
    } catch (error) {
        console.error('Booking submission error:', error);
        return { success: false, error: 'There was an error submitting your booking. Please try again.' };
    }
}
