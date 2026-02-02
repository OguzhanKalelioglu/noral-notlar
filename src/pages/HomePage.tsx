import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Play, PlayCircle, Send, Radio, Clock, Calendar } from 'lucide-react';
import { AIIllustrationIcon, ApplePodcastsIcon, InstagramIcon, ScribbleIcon, SpotifyIcon, TwitterIcon } from '@/components/Icons';
import { fetchPodcastFeed, Episode } from '@/lib/rss';
import { AudioPlayer } from '@/components/AudioPlayer';
import { NewsletterForm } from '@/components/NewsletterForm';
export function HomePage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  // RSS Feed'den bölümleri yükle
  useEffect(() => {
    const loadEpisodes = async () => {
      try {
        setLoading(true);
        const feed = await fetchPodcastFeed();
        setEpisodes(feed.episodes);
      } catch (error) {
        console.error('Episodes loading error:', error);
        toast.error('Bölümler yüklenemedi', {
          description: 'RSS Feed\'den bölümler alınırken bir hata oluştu.'
        });
      } finally {
        setLoading(false);
      }
    };

    loadEpisodes();
  }, []);

  const handlePlayEpisode = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  const handleClosePlayer = () => {
    setCurrentEpisode(null);
  };
  return (
    <div className="bg-amber-500 text-deepIndigo-900 font-sans overflow-x-hidden">
      <Header />
      <main className="pb-24">
        <HeroSection />
        <PodcastPlatforms />
        <EpisodesSection loading={loading} episodes={episodes} onPlayEpisode={handlePlayEpisode} />
        <section id="subscribe" className="py-24 md:py-32 bg-deepIndigo-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AudioPlayer episode={currentEpisode} onClose={handleClosePlayer} />
      <Toaster richColors closeButton />
    </div>
  );
}
const Header = () => (
  <header className="sticky top-0 z-50 bg-amber-500/80 backdrop-blur-sm border-b border-deepIndigo-900/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        <a href="/" className="flex items-center gap-2 group">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 32 32" 
            fill="none" 
            className="w-8 h-8 transition-transform group-hover:scale-110"
          >
            {/* Not defteri */}
            <rect x="6" y="2" width="20" height="28" rx="2" fill="#312E81" stroke="#1E1B4B" strokeWidth="1.5"/>
            {/* Spiral delikler */}
            <circle cx="10" cy="5" r="1.5" fill="#FCD34D"/>
            <circle cx="16" cy="5" r="1.5" fill="#FCD34D"/>
            <circle cx="22" cy="5" r="1.5" fill="#FCD34D"/>
            {/* Çizgiler/notlar */}
            <line x1="10" y1="12" x2="22" y2="12" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="10" y1="16" x2="22" y2="16" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="10" y1="20" x2="18" y2="20" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="10" y1="24" x2="20" y2="24" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-2xl font-display font-bold">Nöral Notlar</span>
        </a>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#episodes" className="font-semibold hover:text-offWhite transition-colors">Bölümler</a>
          <a href="#subscribe" className="font-semibold hover:text-offWhite transition-colors">Abone Ol</a>
        </nav>
        <div className="flex items-center gap-2 bg-deepIndigo-900/10 rounded-full p-1">
          <a 
            href="https://open.spotify.com/show/7FP1bUx3o5FL64v9L2zJ5G" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-deepIndigo-900 text-deepIndigo-900 hover:text-offWhite transition-all duration-300 group"
            title="Spotify'da Dinle"
          >
            <SpotifyIcon className="w-5 h-5" />
          </a>
          <a
            href="https://podcasts.apple.com/us/podcast/n%C3%B6ral-notlar/id1847726825"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-deepIndigo-900 text-deepIndigo-900 hover:text-offWhite transition-all duration-300 group"
            title="Apple Podcasts'te Dinle"
          >
            <ApplePodcastsIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </header>
);
const HeroSection = () => (
  <section className="relative overflow-hidden">
    {/* Decorative floating elements - AI themed */}
    <div className="absolute inset-0 pointer-events-none">
      {/* AI Brain chip - top left */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [-2, 2, -2]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[5%] opacity-60"
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="10" y="10" width="60" height="60" rx="4" fill="#DDD6FE" stroke="#8B5CF6" strokeWidth="2"/>
          <circle cx="40" cy="40" r="15" fill="#A78BFA" stroke="#7C3AED" strokeWidth="2"/>
          <circle cx="40" cy="40" r="8" fill="#C084FC"/>
          <line x1="25" y1="40" x2="15" y2="40" stroke="#8B5CF6" strokeWidth="2"/>
          <line x1="55" y1="40" x2="65" y2="40" stroke="#8B5CF6" strokeWidth="2"/>
          <line x1="40" y1="25" x2="40" y2="15" stroke="#8B5CF6" strokeWidth="2"/>
          <line x1="40" y1="55" x2="40" y2="65" stroke="#8B5CF6" strokeWidth="2"/>
          <circle cx="25" cy="25" r="3" fill="#6366F1"/>
          <circle cx="55" cy="25" r="3" fill="#6366F1"/>
          <circle cx="25" cy="55" r="3" fill="#6366F1"/>
          <circle cx="55" cy="55" r="3" fill="#6366F1"/>
        </svg>
      </motion.div>

      {/* Neural network node - top right */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-[10%] opacity-50"
      >
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
          <circle cx="45" cy="45" r="18" fill="#C4B5FD" stroke="#8B5CF6" strokeWidth="2"/>
          <circle cx="45" cy="45" r="10" fill="#DDD6FE"/>
          <circle cx="20" cy="20" r="8" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1.5"/>
          <circle cx="70" cy="20" r="8" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1.5"/>
          <circle cx="20" cy="70" r="8" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1.5"/>
          <circle cx="70" cy="70" r="8" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1.5"/>
          <line x1="28" y1="24" x2="37" y2="35" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.6"/>
          <line x1="62" y1="24" x2="53" y2="35" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.6"/>
          <line x1="28" y1="66" x2="37" y2="55" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.6"/>
          <line x1="62" y1="66" x2="53" y2="55" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.6"/>
        </svg>
      </motion.div>

      {/* Robot head - middle left */}
      <motion.div
        animate={{ 
          rotate: [-5, 5, -5],
          y: [0, -15, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[45%] left-[2%] opacity-40"
      >
        <svg width="70" height="80" viewBox="0 0 70 80" fill="none">
          <rect x="10" y="20" width="50" height="50" rx="8" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2"/>
          <circle cx="25" cy="40" r="6" fill="#3B82F6"/>
          <circle cx="45" cy="40" r="6" fill="#3B82F6"/>
          <rect x="25" y="55" width="20" height="4" rx="2" fill="#6366F1"/>
          <line x1="35" y1="10" x2="35" y2="20" stroke="#6366F1" strokeWidth="2"/>
          <circle cx="35" cy="8" r="4" fill="#93C5FD" stroke="#6366F1" strokeWidth="2"/>
          <rect x="5" y="35" width="8" height="12" rx="2" fill="#C7D2FE" stroke="#6366F1" strokeWidth="1.5"/>
          <rect x="57" y="35" width="8" height="12" rx="2" fill="#C7D2FE" stroke="#6366F1" strokeWidth="1.5"/>
        </svg>
      </motion.div>

      {/* Data bits - bottom left */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-[20%] left-[8%] opacity-50"
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <text x="5" y="20" fill="#8B5CF6" fontSize="24" fontWeight="bold" fontFamily="monospace">01</text>
          <text x="5" y="45" fill="#A78BFA" fontSize="24" fontWeight="bold" fontFamily="monospace">10</text>
          <circle cx="50" cy="15" r="4" fill="#C084FC"/>
          <circle cx="50" cy="40" r="4" fill="#DDD6FE"/>
          <line x1="30" y1="15" x2="46" y2="15" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="2 2"/>
          <line x1="30" y1="40" x2="46" y2="40" stroke="#A78BFA" strokeWidth="2" strokeDasharray="2 2"/>
        </svg>
      </motion.div>

      {/* CPU/Processor - top right area */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 360]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute top-[15%] right-[5%] opacity-50"
      >
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <rect x="15" y="15" width="40" height="40" rx="3" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
          <rect x="25" y="25" width="20" height="20" rx="2" fill="#60A5FA" stroke="#1E40AF" strokeWidth="1.5"/>
          <line x1="5" y1="20" x2="15" y2="20" stroke="#3B82F6" strokeWidth="2"/>
          <line x1="5" y1="30" x2="15" y2="30" stroke="#3B82F6" strokeWidth="2"/>
          <line x1="5" y1="40" x2="15" y2="40" stroke="#3B82F6" strokeWidth="2"/>
          <line x1="5" y1="50" x2="15" y2="50" stroke="#3B82F6" strokeWidth="2"/>
          <line x1="55" y1="20" x2="65" y2="20" stroke="#3B82F6" strokeWidth="2"/>
          <line x1="55" y1="30" x2="65" y2="30" stroke="#3B82F6" strokeWidth="2"/>
          <line x1="55" y1="40" x2="65" y2="40" stroke="#3B82F6" strokeWidth="2"/>
          <line x1="55" y1="50" x2="65" y2="50" stroke="#3B82F6" strokeWidth="2"/>
        </svg>
      </motion.div>

      {/* AI sparkles/stars */}
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[25%] left-[20%]"
      >
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
          <path d="M 12.5 0 L 15 10 L 25 12.5 L 15 15 L 12.5 25 L 10 15 L 0 12.5 L 10 10 Z" fill="#06B6D4"/>
        </svg>
      </motion.div>

      <motion.div
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute bottom-[30%] right-[15%]"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M 10 0 L 12 8 L 20 10 L 12 12 L 10 20 L 8 12 L 0 10 L 8 8 Z" fill="#8B5CF6"/>
        </svg>
      </motion.div>

      {/* Machine learning graph - bottom right */}
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-[15%] right-[3%] opacity-50"
      >
        <svg width="90" height="70" viewBox="0 0 90 70" fill="none">
          <rect x="5" y="5" width="80" height="60" rx="4" fill="#F0F9FF" stroke="#0EA5E9" strokeWidth="2"/>
          <polyline points="15,50 25,40 35,45 45,25 55,30 65,15 75,20" stroke="#06B6D4" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <circle cx="15" cy="50" r="3" fill="#0EA5E9"/>
          <circle cx="25" cy="40" r="3" fill="#0EA5E9"/>
          <circle cx="35" cy="45" r="3" fill="#0EA5E9"/>
          <circle cx="45" cy="25" r="3" fill="#06B6D4"/>
          <circle cx="55" cy="30" r="3" fill="#06B6D4"/>
          <circle cx="65" cy="15" r="3" fill="#06B6D4"/>
          <circle cx="75" cy="20" r="3" fill="#0EA5E9"/>
        </svg>
      </motion.div>

      {/* Circuit pattern - middle right */}
      <motion.div
        animate={{ 
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[55%] right-[8%] opacity-45"
      >
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <circle cx="35" cy="35" r="8" fill="#C084FC" stroke="#8B5CF6" strokeWidth="2"/>
          <circle cx="15" cy="15" r="5" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="1.5"/>
          <circle cx="55" cy="15" r="5" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="1.5"/>
          <circle cx="15" cy="55" r="5" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="1.5"/>
          <circle cx="55" cy="55" r="5" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="1.5"/>
          <path d="M 20 15 L 27 28" stroke="#8B5CF6" strokeWidth="2"/>
          <path d="M 50 15 L 43 28" stroke="#8B5CF6" strokeWidth="2"/>
          <path d="M 20 55 L 27 42" stroke="#8B5CF6" strokeWidth="2"/>
          <path d="M 50 55 L 43 42" stroke="#8B5CF6" strokeWidth="2"/>
          <rect x="30" y="10" width="10" height="6" rx="1" fill="#A78BFA"/>
          <rect x="10" y="30" width="6" height="10" rx="1" fill="#A78BFA"/>
          <rect x="54" y="30" width="6" height="10" rx="1" fill="#A78BFA"/>
          <rect x="30" y="54" width="10" height="6" rx="1" fill="#A78BFA"/>
        </svg>
      </motion.div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-deepIndigo-900 leading-tight">
            Yapay Zeka ile <br /> Geleceği Keşfet.
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-deepIndigo-900/80">
            Nöral Notlar'a hoş geldiniz! Yapay zeka, makine öğrenimi ve teknolojinin geleceğini anlatan podcast. CodeMAN artık sitenin yönetiminde, AI'nın büyülü dünyasını birlikte keşfedelim.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-deepIndigo-900 text-offWhite hover:bg-deepIndigo-800 transition-all duration-300 transform hover:scale-105 shadow-lg px-6 py-6 text-lg">
              <a href="https://open.spotify.com/show/7FP1bUx3o5FL64v9L2zJ5G" target="_blank" rel="noopener noreferrer">
                <SpotifyIcon className="mr-2 h-6 w-6" />
                Spotify'da Dinle
              </a>
            </Button>
            <Button asChild size="lg" className="bg-deepIndigo-900 text-offWhite hover:bg-deepIndigo-800 transition-all duration-300 transform hover:scale-105 shadow-lg px-6 py-6 text-lg">
              <a href="https://podcasts.apple.com/us/podcast/n%C3%B6ral-notlar/id1847726825" target="_blank" rel="noopener noreferrer">
                <ApplePodcastsIcon className="mr-2 h-6 w-6" />
                Apple Podcasts
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
const PodcastPlatforms = () => (
  <div className="py-12 bg-amber-600">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        <p className="text-lg font-semibold text-offWhite">Dinle ve abone ol:</p>
        <div className="flex items-center gap-8">
          <a href="https://open.spotify.com/show/7FP1bUx3o5FL64v9L2zJ5G" target="_blank" rel="noopener noreferrer" className="text-offWhite hover:text-deepIndigo-200 transition-colors"><SpotifyIcon className="w-10 h-10" /></a>
          <a href="https://podcasts.apple.com/us/podcast/n%C3%B6ral-notlar/id1847726825" target="_blank" rel="noopener noreferrer" className="text-offWhite hover:text-deepIndigo-200 transition-colors"><ApplePodcastsIcon className="w-10 h-10" /></a>
        </div>
      </div>
    </div>
  </div>
);
const EpisodesSection = ({ loading, episodes, onPlayEpisode }: {
  loading: boolean;
  episodes: Episode[];
  onPlayEpisode: (episode: Episode) => void;
}) => (
  <section id="episodes" className="bg-offWhite text-deepIndigo-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold">Son Bölümler</h2>
        <p className="mt-4 text-lg text-deepIndigo-900/70 max-w-2xl mx-auto">
          Yapay zeka dünyasındaki en son gelişmeleri ve derin teknoloji sohbetlerini kaçırma.
        </p>
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        {loading ? (
          // Loading state
          <div className="flex flex-col gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row items-center">
                  <div className="w-full sm:w-48 h-48 bg-gray-200"></div>
                  <div className="flex flex-col flex-grow p-6 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : episodes.length > 0 ? (
          // Episodes loaded
          <div className="flex flex-col gap-8">
            {episodes.map((episode, index) => (
              <motion.div
                key={episode.guid || index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col sm:flex-row items-center">
                  <div className="w-full sm:w-48 flex-shrink-0 mx-4">
                    <img
                      src={episode.iTunes?.image || '/src/assets/noral-notlar-logo.png'}
                      alt={episode.title}
                      className="w-full h-48 sm:h-full object-cover rounded-lg"
                      onError={(e) => {
                        console.log('Image failed to load:', episode.iTunes?.image);
                        const target = e.target as HTMLImageElement;
                        target.src = '/src/assets/noral-notlar-logo.png';
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', episode.iTunes?.image);
                      }}
                    />
                  </div>
                  <div className="flex flex-col flex-grow p-6">
                    <CardHeader className="p-0">
                      <CardTitle className="text-2xl font-bold">{episode.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 pt-2 flex-grow">
                      <p className="text-deepIndigo-900/80 mb-3">{episode.description}</p>
                      <div className="flex items-center gap-4 text-sm text-deepIndigo-900/60">
                        {episode.iTunes?.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{episode.iTunes.duration}</span>
                          </div>
                        )}
                        {episode.pubDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(episode.pubDate).toLocaleDateString('tr-TR')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-0 pt-4 flex justify-between items-center">
                      <span className="text-sm font-medium text-deepIndigo-900/60">
                        {episode.iTunes?.duration || 'Podcast Bölümü'}
                      </span>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="lg"
                          className="bg-amber-500 hover:bg-amber-400 text-deepIndigo-900 font-semibold h-12 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => onPlayEpisode(episode)}
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Dinle
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          // No episodes found
          <div className="text-center py-12">
            <Radio className="w-16 h-16 mx-auto text-deepIndigo-900/30 mb-4" />
            <h3 className="text-xl font-semibold text-deepIndigo-900 mb-2">
              Henüz Bölüm Bulunamadı
            </h3>
            <p className="text-deepIndigo-900/70">
              RSS Feed'den bölümler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        )}
      </div>
    </div>
  </section>
);
const Footer = () => (
  <footer className="relative bg-deepIndigo-950 text-offWhite/70 overflow-hidden">
    {/* Decorative floating elements */}
    <div className="absolute inset-0 pointer-events-none">
      {/* Small balloon - left */}
      <motion.div
        animate={{ 
          y: [0, -25, 0],
          rotate: [-3, 3, -3]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-[8%] opacity-30"
      >
        <svg width="50" height="65" viewBox="0 0 50 65" fill="none">
          <ellipse cx="25" cy="22" rx="22" ry="28" fill="#C4B5FD" stroke="#A78BFA" strokeWidth="1.5"/>
          <path d="M 25 22 Q 22 25, 25 28 Q 28 25, 25 22" fill="#DDD6FE" opacity="0.5"/>
          <line x1="25" y1="50" x2="25" y2="57" stroke="#A78BFA" strokeWidth="1.5"/>
          <line x1="15" y1="45" x2="18" y2="52" stroke="#A78BFA" strokeWidth="1.5"/>
          <line x1="35" y1="45" x2="32" y2="52" stroke="#A78BFA" strokeWidth="1.5"/>
          <rect x="19" y="57" width="12" height="6" rx="1.5" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="1.5"/>
        </svg>
      </motion.div>

      {/* Star - top left */}
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 left-[15%]"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M 10 0 L 12 8 L 20 10 L 12 12 L 10 20 L 8 12 L 0 10 L 8 8 Z" fill="#FCD34D"/>
        </svg>
      </motion.div>

      {/* Music note - right */}
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, -8, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-12 right-[12%] opacity-25"
      >
        <svg width="35" height="50" viewBox="0 0 35 50" fill="none">
          <ellipse cx="10" cy="42" rx="8" ry="6" fill="#C084FC" stroke="#A78BFA" strokeWidth="1.5"/>
          <rect x="17" y="14" width="3" height="30" fill="#A78BFA" rx="1.5"/>
          <path d="M 20 14 Q 28 10, 32 14 L 32 25 Q 28 21, 20 25 Z" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="1"/>
        </svg>
      </motion.div>

      {/* Small cloud - center right */}
      <motion.div
        animate={{ 
          x: [0, 15, 0],
          y: [0, -8, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-16 right-[25%] opacity-20"
      >
        <svg width="70" height="35" viewBox="0 0 70 35" fill="none">
          <ellipse cx="18" cy="20" rx="15" ry="12" fill="#DDD6FE"/>
          <ellipse cx="35" cy="17" rx="18" ry="15" fill="#C4B5FD"/>
          <ellipse cx="52" cy="20" rx="15" ry="12" fill="#DDD6FE"/>
        </svg>
      </motion.div>

      {/* Sparkle - bottom right */}
      <motion.div
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-20 right-[8%]"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M 9 0 L 10.5 7.5 L 18 9 L 10.5 10.5 L 9 18 L 7.5 10.5 L 0 9 L 7.5 7.5 Z" fill="#FCA5A5"/>
        </svg>
      </motion.div>

      {/* Microphone icon - left side */}
      <motion.div
        animate={{ 
          y: [0, -12, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute top-10 left-[35%] opacity-25"
      >
        <svg width="30" height="40" viewBox="0 0 30 40" fill="none">
          <ellipse cx="15" cy="12" rx="8" ry="10" fill="#A78BFA" stroke="#8B5CF6" strokeWidth="1.5"/>
          <line x1="15" y1="22" x2="15" y2="30" stroke="#8B5CF6" strokeWidth="2"/>
          <path d="M 10 22 Q 15 24, 20 22" stroke="#8B5CF6" strokeWidth="1.5" fill="none"/>
          <ellipse cx="15" cy="30" rx="6" ry="2" fill="#8B5CF6" opacity="0.7"/>
        </svg>
      </motion.div>

      {/* Headphone - right side */}
      <motion.div
        animate={{ 
          rotate: [-4, 4, -4],
          y: [0, -10, 0]
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-24 right-[40%] opacity-20"
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path d="M 12 25 Q 12 10, 25 8 Q 38 10, 38 25" stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <rect x="8" y="22" width="7" height="12" rx="3.5" fill="#DDD6FE" stroke="#C4B5FD" strokeWidth="1.5"/>
          <rect x="35" y="22" width="7" height="12" rx="3.5" fill="#DDD6FE" stroke="#C4B5FD" strokeWidth="1.5"/>
        </svg>
      </motion.div>

      {/* Vinyl record - small */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.08, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute top-16 right-[20%] opacity-20"
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="19" fill="#4C1D95" stroke="#7C3AED" strokeWidth="1.5"/>
          <circle cx="20" cy="20" r="14" fill="#2E1065" opacity="0.8"/>
          <circle cx="20" cy="20" r="9" fill="#4C1D95"/>
          <circle cx="20" cy="20" r="5" fill="#FCD34D"/>
          <circle cx="20" cy="20" r="2.5" fill="#2E1065"/>
        </svg>
      </motion.div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 32 32" 
            fill="none" 
            className="w-6 h-6"
          >
            {/* Not defteri */}
            <rect x="6" y="2" width="20" height="28" rx="2" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="1.5"/>
            {/* Spiral delikler */}
            <circle cx="10" cy="5" r="1.5" fill="#FCD34D"/>
            <circle cx="16" cy="5" r="1.5" fill="#FCD34D"/>
            <circle cx="22" cy="5" r="1.5" fill="#FCD34D"/>
            {/* Çizgiler/notlar */}
            <line x1="10" y1="12" x2="22" y2="12" stroke="#DDD6FE" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="10" y1="16" x2="22" y2="16" stroke="#DDD6FE" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="10" y1="20" x2="18" y2="20" stroke="#DDD6FE" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="10" y1="24" x2="20" y2="24" stroke="#DDD6FE" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-xl font-display font-bold text-offWhite">Nöral Notlar</span>
        </div>
        <img 
          src="/src/assets/noral-notlar-logo.png" 
          alt="Nöral Notlar Logo" 
          className="w-[100px] h-[100px] object-contain opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>
      <div className="mt-8 text-center text-sm border-t border-deepIndigo-800 pt-8">
        <p>&copy; {new Date().getFullYear()} Nöral Notlar. Tüm Hakları Saklıdır.</p>
        <p className="mt-2">Cloudflare'de ❤️ ile yapıldı</p>
      </div>
    </div>
  </footer>
);