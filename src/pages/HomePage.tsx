import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PlayCircle, Send } from 'lucide-react';
import { AIIllustrationIcon, ApplePodcastsIcon, InstagramIcon, ScribbleIcon, SpotifyIcon, TwitterIcon } from '@/components/Icons';
const episodes = [
  {
    id: 1,
    title: 'The Art of Doodling',
    description: 'Exploring how simple sketches can unlock complex ideas and boost creativity.',
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1589792933539-201c35a831b1?q=80&w=400&h=400&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Color Theory for Thinkers',
    description: 'A deep dive into the psychology of color and how it shapes our world.',
    duration: '52 min',
    image: 'https://images.unsplash.com/photo-1558470598-a5dda9640f68?q=80&w=400&h=400&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Typography that Speaks',
    description: 'From serifs to sans-serifs, we chat about what makes a typeface truly sing.',
    duration: '38 min',
    image: 'https://images.unsplash.com/photo-1596495577886-d9256f44224b?q=80&w=400&h=400&auto=format&fit=crop',
  },
];
export function HomePage() {
  const [email, setEmail] = useState('');
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /^\S+@\S+\.\S+$/.test(email)) {
      toast.success("You're on the list!", {
        description: "Thanks for subscribing to ScribbleCast. We'll be in your inbox soon.",
      });
      setEmail('');
    } else {
      toast.error('Oops!', {
        description: 'Please enter a valid email address.',
      });
    }
  };
  return (
    <div className="bg-amber-500 text-deepIndigo-900 font-sans overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <PodcastPlatforms />
        <EpisodesSection />
        <NewsletterSection email={email} setEmail={setEmail} onSubmit={handleNewsletterSubmit} />
      </main>
      <Footer />
      <Toaster richColors closeButton />
    </div>
  );
}
const Header = () => (
  <header className="sticky top-0 z-50 bg-amber-500/80 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        <a href="/" className="flex items-center gap-2 group">
          <ScribbleIcon className="w-8 h-8 text-deepIndigo-900 group-hover:rotate-12 transition-transform" />
          <span className="text-2xl font-display font-bold">ScribbleCast</span>
        </a>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#episodes" className="font-semibold hover:text-offWhite transition-colors">Episodes</a>
          <a href="#subscribe" className="font-semibold hover:text-offWhite transition-colors">Subscribe</a>
        </nav>
        <Button asChild className="bg-deepIndigo-900 text-offWhite hover:bg-deepIndigo-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
          <a href="#episodes">Listen Now</a>
        </Button>
      </div>
    </div>
  </header>
);
const HeroSection = () => (
  <section className="relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-deepIndigo-900 leading-tight">
            Where Creativity <br /> Finds Its Voice.
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-lg mx-auto md:mx-0 text-deepIndigo-900/80">
            Welcome to ScribbleCast, the podcast that colors outside the lines. Join us as we explore the whimsical world of design, art, and creative thinking.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Button asChild size="lg" className="bg-deepIndigo-900 text-offWhite hover:bg-deepIndigo-800 transition-all duration-300 transform hover:scale-105 shadow-lg px-6 py-6 text-lg">
              <a href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer">
                <SpotifyIcon className="mr-2 h-6 w-6" />
                Listen on Spotify
              </a>
            </Button>
            <Button asChild size="lg" className="bg-deepIndigo-900 text-offWhite hover:bg-deepIndigo-800 transition-all duration-300 transform hover:scale-105 shadow-lg px-6 py-6 text-lg">
              <a href="https://podcasts.apple.com/" target="_blank" rel="noopener noreferrer">
                <ApplePodcastsIcon className="mr-2 h-6 w-6" />
                Apple Podcasts
              </a>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-offWhite/30 rounded-full blur-2xl animate-pulse"></div>
          <AIIllustrationIcon className="relative w-64 h-64 lg:w-80 lg:h-80 mx-auto text-deepIndigo-900 animate-float" />
        </motion.div>
      </div>
    </div>
  </section>
);
const PodcastPlatforms = () => (
  <div className="py-12 bg-amber-600">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        <p className="text-lg font-semibold text-offWhite">Listen and subscribe on:</p>
        <div className="flex items-center gap-8">
          <a href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer" className="text-offWhite hover:text-deepIndigo-200 transition-colors"><SpotifyIcon className="w-10 h-10" /></a>
          <a href="https://podcasts.apple.com/" target="_blank" rel="noopener noreferrer" className="text-offWhite hover:text-deepIndigo-200 transition-colors"><ApplePodcastsIcon className="w-10 h-10" /></a>
        </div>
      </div>
    </div>
  </div>
);
const EpisodesSection = () => (
  <section id="episodes" className="bg-offWhite text-deepIndigo-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold">Latest Episodes</h2>
        <p className="mt-4 text-lg text-deepIndigo-900/70 max-w-2xl mx-auto">
          Catch up on our recent conversations. There's always something new to discover.
        </p>
      </div>
      <div className="mt-12 max-w-3xl mx-auto flex flex-col gap-8">
        {episodes.map((episode, index) => (
          <motion.div
            key={episode.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col sm:flex-row items-center">
              <div className="w-full sm:w-48 flex-shrink-0">
                <img src={episode.image} alt={episode.title} className="w-full h-48 sm:h-full object-cover" />
              </div>
              <div className="flex flex-col flex-grow p-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-2xl font-bold">{episode.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-2 flex-grow">
                  <p className="text-deepIndigo-900/80">{episode.description}</p>
                </CardContent>
                <CardFooter className="p-0 pt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-deepIndigo-900/60">{episode.duration}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-deepIndigo-900 hover:bg-amber-100"
                    onClick={() => toast.info('Playing episode!', { description: `${episode.title}` })}
                  >
                    <PlayCircle className="w-8 h-8" />
                  </Button>
                </CardFooter>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
interface NewsletterSectionProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}
const NewsletterSection = ({ email, setEmail, onSubmit }: NewsletterSectionProps) => (
  <section id="subscribe" className="bg-deepIndigo-900 text-offWhite">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold">Never Miss a Doodle</h2>
        <p className="mt-4 text-lg text-offWhite/80">
          Subscribe to our newsletter for behind-the-scenes content, episode announcements, and creative prompts delivered right to your inbox.
        </p>
        <form onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow bg-deepIndigo-800 border-deepIndigo-700 text-offWhite placeholder:text-offWhite/50 focus:ring-amber-500 h-14 text-lg"
            required
          />
          <Button type="submit" size="lg" className="bg-amber-500 text-deepIndigo-900 hover:bg-amber-400 h-14 text-lg font-bold">
            <Send className="mr-2 h-5 w-5" />
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  </section>
);
const Footer = () => (
  <footer className="bg-deepIndigo-950 text-offWhite/70">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <ScribbleIcon className="w-6 h-6" />
          <span className="text-xl font-display font-bold text-offWhite">ScribbleCast</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors"><TwitterIcon className="w-6 h-6" /></a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors"><InstagramIcon className="w-6 h-6" /></a>
        </div>
      </div>
      <div className="mt-8 text-center text-sm border-t border-deepIndigo-800 pt-8">
        <p>&copy; {new Date().getFullYear()} ScribbleCast. All Rights Reserved.</p>
        <p className="mt-2">Built with ❤️ at Cloudflare</p>
      </div>
    </div>
  </footer>
);