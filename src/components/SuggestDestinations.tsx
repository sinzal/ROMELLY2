'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { handleSuggestDestinations } from '@/app/actions';

export default function SuggestDestinations() {
  const [region, setRegion] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!region) {
      setError('Please enter a region to get suggestions.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuggestions([]);

    const result = await handleSuggestDestinations(region);

    if (result.success && result.data) {
      setSuggestions(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g., Southeast Asia, The Mediterranean, Scandinavia"
            className="flex-grow"
            aria-label="Region for travel suggestions"
          />
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suggesting...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Suggest
              </>
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {suggestions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 font-headline">Destination Ideas:</h3>
            <ul className="list-disc list-inside bg-primary/5 p-4 rounded-md space-y-2">
              {suggestions.map((dest, index) => (
                <li key={index} className="text-foreground/90">{dest}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
