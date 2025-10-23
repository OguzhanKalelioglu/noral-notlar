import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, CheckCircle } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate email
      if (!email || !email.includes('@')) {
        setError('Geçerli bir e-posta adresi girin');
        return;
      }

      // Call API to subscribe
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Abonelik başarısız oldu');
        return;
      }

      setIsSubscribed(true);
      setEmail('');
      console.log('New subscriber:', email);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setError('Bir hata oluştu, lütfen tekrar deneyin');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="bg-deepIndigo-800/50 border-deepIndigo-700 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-offWhite mb-2">
            Aboneliğiniz Başarılı!
          </h3>
          <p className="text-offWhite/70">
            Artık en yeni bölümlerden haberdar olacaksınız.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-deepIndigo-800/50 border-deepIndigo-700 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl md:text-4xl font-display font-bold text-offWhite">
          Hiçbir Nöral Notu Kaçırma
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="E-posta adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-deepIndigo-900/50 border-deepIndigo-600 text-offWhite placeholder:text-offWhite/50 focus:border-amber-500 focus:ring-amber-500/20"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-md border border-red-800/30">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-amber-500 hover:bg-amber-400 text-deepIndigo-900 font-semibold transition-all duration-200 transform hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-deepIndigo-900 border-t-transparent rounded-full animate-spin" />
                <span>Abone Olunuyor...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>Abone Ol</span>
              </div>
            )}
          </Button>
        </form>

        <p className="text-xs text-offWhite/50 text-center mt-4">
          Spam göndermiyoruz. İstediğiniz zaman abonelikten ayrılabilirsiniz.
        </p>
      </CardContent>
    </Card>
  );
}