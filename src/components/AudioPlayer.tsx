import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { Episode } from '@/lib/rss';
import { PODCAST_FALLBACK_IMAGE } from '@/lib/assets';

interface AudioPlayerProps {
  episode: Episode | null;
  onClose: () => void;
}

export function AudioPlayer({ episode, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleLoadedData = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleCanPlay = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleLoadStart = () => {
      setDuration(0);
      setCurrentTime(0);
    };

    // Event listeners
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);

    // Initial duration check
    if (audio.duration && !isNaN(audio.duration)) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [episode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (episode && audioRef.current) {
      const audio = audioRef.current;

      // Reset states
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);

      // Set new source and load
      audio.src = episode.enclosure.url;
      audio.load(); // Force reload to trigger metadata events

      // Auto-play when episode is loaded
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log('Auto-play was prevented:', error);
            setIsPlaying(false);
          });
      }

      // Try to get duration after a short delay
      const checkDuration = setTimeout(() => {
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      }, 1000);

      return () => clearTimeout(checkDuration);
    }
  }, [episode]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, duration);
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!episode) return null;

  return (
    <>
      <audio ref={audioRef} />
      <div className="fixed bottom-0 left-0 right-0 bg-deepIndigo-900 border-t border-deepIndigo-800 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
        <Card className="rounded-none border-0 bg-transparent shadow-none">
          <CardContent className="p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4">
                {/* Episode Image */}
                <div className="flex-shrink-0">
                  <img
                    src={episode.iTunes?.image || PODCAST_FALLBACK_IMAGE}
                    alt={episode.title}
                    className="w-16 h-16 rounded-xl object-cover shadow-lg"
                  />
                </div>

                {/* Episode Info */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-offWhite truncate">{episode.title}</h3>
                  <p className="text-sm text-offWhite/70 truncate">
                    {new Date(episode.pubDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>

                {/* Player Controls */}
                <div className="flex items-center gap-2 md:gap-4">
                  {/* Skip Backward */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex text-offWhite hover:bg-deepIndigo-800 h-8 w-8"
                    onClick={skipBackward}
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>

                  {/* Play/Pause */}
                  <Button
                    size="icon"
                    className="bg-amber-500 hover:bg-amber-400 text-deepIndigo-900 h-10 w-10 rounded-full"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>

                  {/* Skip Forward */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex text-offWhite hover:bg-deepIndigo-800 h-8 w-8"
                    onClick={skipForward}
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>

                  {/* Time Display */}
                  <div className="hidden md:flex items-center gap-2 text-sm text-offWhite/70 min-w-[100px]">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                  </div>

                  {/* Volume Control */}
                  <div className="hidden md:flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-offWhite/70" />
                    <Slider
                      value={[volume * 100]}
                      onValueChange={(value) => setVolume(value[0] / 100)}
                      max={100}
                      step={1}
                      className="w-20"
                      orientation="horizontal"
                    />
                  </div>

                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-offWhite hover:bg-deepIndigo-800 h-8 w-8"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <Slider
                  value={[currentTime]}
                  onValueChange={handleSeek}
                  max={duration || 100}
                  step={1}
                  className="w-full"
                  orientation="horizontal"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
