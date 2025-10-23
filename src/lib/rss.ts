import { z } from 'zod';

// RSS Episode veri yapısı
export const EpisodeSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.string(),
  enclosure: z.object({
    url: z.string(),
    type: z.string(),
    length: z.string().optional(),
  }),
  iTunes: z.object({
    duration: z.string().optional(),
    image: z.string().optional(),
    summary: z.string().optional(),
  }).optional(),
  guid: z.string().optional(),
  link: z.string().optional(),
});

export type Episode = z.infer<typeof EpisodeSchema>;

export interface PodcastFeed {
  title: string;
  description: string;
  image: string;
  episodes: Episode[];
}

// RSS Feed'den podcast verilerini çeken fonksiyon
export async function fetchPodcastFeed(): Promise<PodcastFeed> {
  const RSS_URL = 'https://anchor.fm/s/1060b0390/podcast/rss';

  try {
    console.log('RSS Feed fetching started...');

    // Öncelikle RSS2JSON servisini kullanalım (daha güvenilir)
    try {
      console.log('Trying RSS2JSON service...');
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`);

      if (response.ok) {
        console.log('RSS2JSON response received');
        const data = await response.json();

        // Başarılı ise verileri dönüştür
        if (data.items && data.items.length > 0) {
          console.log(`Found ${data.items.length} episodes`);
          return {
            title: data.feed.title || 'Nöral Notlar',
            description: data.feed.description || '',
            image: data.feed.image || '/src/assets/noral-notlar-logo.png',
            episodes: data.items.slice(0, 3).map((item: any, index: number) => ({
              title: item.title || '',
              description: (item.description || '').replace(/<[^>]*>/g, '').substring(0, 200) + '...',
              pubDate: item.pubDate || '',
              enclosure: {
                url: item.enclosure?.link || item.link || '', // Doğru enclosure linkini kullan
                type: item.enclosure?.type || 'audio/mpeg',
                length: item.enclosure?.length?.toString() || '',
              },
              iTunes: {
                duration: item.enclosure?.duration ? Math.floor(item.enclosure.duration / 60) + ':' +
                           String(Math.floor(item.enclosure.duration % 60)).padStart(2, '0') : '',
                image: item.thumbnail || item.enclosure?.image || '/src/assets/noral-notlar-logo.png',
                summary: (item.description || '').replace(/<[^>]*>/g, '').substring(0, 200) + '...',
              },
              guid: item.guid || `episode-${index}`,
              link: item.link || '',
            }))
          };
        } else {
          console.warn('No items found in RSS2JSON response');
        }
      } else {
        console.warn(`RSS2JSON failed with status: ${response.status}`);
      }
    } catch (error) {
      console.warn('RSS2JSON service failed:', error);
    }

    // XML parsing denemesi (fallback)
    console.log('Trying XML parsing with proxy...');
    let xmlText = '';

    // allorigins.win denemesi
    try {
      const response1 = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`);
      if (response1.ok) {
        const data = await response1.json();
        xmlText = data.contents;
        console.log('Got XML from allorigins.win');
      }
    } catch (error) {
      console.warn('allorigins.win failed:', error);
    }

    // XML'i parse etmek için DOMParser kullanıyoruz
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Parse hatalarını kontrol et
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('XML parsing failed');
    }

    // Podcast kanal bilgilerini al
    const channel = xmlDoc.querySelector('channel');
    if (!channel) {
      throw new Error('No channel found in RSS feed');
    }

    const title = channel.querySelector('title')?.textContent || 'Nöral Notlar';
    const description = channel.querySelector('description')?.textContent || '';
    const image = channel.querySelector('image url')?.textContent ||
                  channel.querySelector('itunes\\:image')?.getAttribute('href') ||
                  '/src/assets/noral-notlar-logo.png';

    // Bölümleri al
    const items = Array.from(xmlDoc.querySelectorAll('item'));
    const episodes: Episode[] = items.slice(0, 3).map((item, index) => {
      const title = item.querySelector('title')?.textContent || '';
      const description = item.querySelector('description')?.textContent ||
                          item.querySelector('itunes\\:summary')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const enclosure = item.querySelector('enclosure');
      const duration = item.querySelector('itunes\\:duration')?.textContent || '';
      const episodeImage = item.querySelector('itunes\\:image')?.getAttribute('href') ||
                           channel.querySelector('image url')?.textContent ||
                           '/src/assets/noral-notlar-logo.png';
      const guid = item.querySelector('guid')?.textContent || `episode-${index}`;
      const link = item.querySelector('link')?.textContent || '';

      return {
        title,
        description: description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        pubDate,
        enclosure: {
          url: enclosure?.getAttribute('url') || '',
          type: enclosure?.getAttribute('type') || 'audio/mpeg',
          length: enclosure?.getAttribute('length') || '',
        },
        iTunes: {
          duration,
          image: episodeImage,
          summary: description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        },
        guid,
        link,
      };
    });

    return {
      title,
      description,
      image,
      episodes,
    };
  } catch (error) {
    console.error('RSS feed fetch error:', error);
    // Fallback veri
    return {
      title: 'Nöral Notlar',
      description: 'Yapay zeka ve teknoloji podcast',
      image: '/src/assets/noral-notlar-logo.png',
      episodes: [],
    };
  }
}