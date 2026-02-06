import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ExternalLink, Mic, RefreshCw, Zap, Flame, Newspaper, Calendar, ArrowRight, ArrowLeft, CheckCircle, Send } from 'lucide-react';
import { Toaster, toast } from '@/components/ui/sonner';

interface RadarItem {
  id: number;
  twitter_id: string;
  author_name: string;
  author_username: string;
  content: string;
  summary: string;
  category: string;
  url: string;
  media_url?: string;
  is_podcast_candidate: boolean;
  source: 'like' | 'discovery';
  created_at: string;
}

export default function Radar() {
  const [items, setItems] = useState<RadarItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Newsletter State
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/radar');
      const data = await res.json();
      if (data.success) {
        // Yeniden eskiye sırala (created_at)
        const sorted = data.data.sort((a: RadarItem, b: RadarItem) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setItems(sorted);
      } else {
        toast.error('Veriler yüklenemedi');
      }
    } catch (err) {
      console.error(err);
      toast.error('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e?: any) => {
    if (e) e.preventDefault();
    
    console.log('Abonelik denemesi:', email, 'KVKK:', kvkkAccepted);

    if (!email || !email.includes('@')) {
        toast.error('Lütfen geçerli bir e-posta adresi girin.');
        return;
    }

    if (!kvkkAccepted) {
      toast.error('Lütfen KVKK şartlarını onaylayın.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSubscribed(true);
        toast.success('Nöral Radar ailesine hoş geldin!');
      } else {
        toast.error(data.error || 'Abonelik sırasında bir hata oluştu.');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      toast.error('Sunucuya bağlanılamadı, lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const likedItems = items.filter(item => item.source === 'like' || !item.source);
  const discoveredItems = items.filter(item => item.source === 'discovery');

  const RadarGrid = ({ data, emptyMessage, emptyIcon: EmptyIcon }: { data: RadarItem[], emptyMessage: string, emptyIcon: any }) => (
    <>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item) => (
            <Card key={item.id} className="bg-white border-slate-200 hover:border-indigo-600/50 transition-all duration-300 flex flex-col h-full group shadow-sm hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="pb-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold uppercase tracking-wider text-[10px]">
                    {item.category}
                  </Badge>
                  {item.is_podcast_candidate && (
                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      <Mic className="h-3 w-3" /> Podcast Adayı
                    </div>
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {item.author_name}
                  </CardTitle>
                  <CardDescription className="text-slate-500 font-medium font-mono text-sm">@{item.author_username}</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="pb-6 flex-grow space-y-5">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors shadow-inner text-slate-800 text-base font-semibold leading-relaxed">
                   {item.summary}
                </div>
                
                {item.media_url && (
                  <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 aspect-video relative shadow-sm">
                     <img src={item.media_url} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  </div>
                )}
                
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600/20 rounded-full" />
                  <p className="text-[13px] text-slate-500 line-clamp-3 italic pl-4 leading-relaxed font-medium">
                    "{item.content}"
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 border-t border-slate-50 flex justify-between items-center bg-slate-50/30 rounded-b-xl px-6 py-5">
                 <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-bold uppercase tracking-tighter">
                      {new Date(item.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                 </div>
                 <Button variant="outline" size="sm" className="border-slate-200 hover:border-indigo-600 hover:text-indigo-600 font-bold rounded-full px-5 transition-all text-xs" asChild>
                   <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                     İncele <ArrowRight className="h-3.5 w-3.5" />
                   </a>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-40 text-slate-400 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <EmptyIcon className="w-16 h-16 mx-auto mb-6 opacity-20 text-indigo-600" />
          <p className="text-2xl font-bold text-slate-600">{emptyMessage}</p>
          <p className="mt-2 text-slate-400 font-medium">Yeni sinyaller taranmaya devam ediyor.</p>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-50 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto py-12 md:py-20 px-4 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-24 gap-12 border-b border-slate-100 pb-16">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-200">
              <Zap className="h-3 w-3 fill-current" /> CANLI TAKİP SİSTEMİ
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]">
              Nöral <br/><span className="text-indigo-600 italic">Radar.</span>
            </h1>
            <p className="text-slate-500 text-xl md:text-2xl font-semibold leading-relaxed max-w-2xl border-l-4 border-indigo-600/20 pl-6">
              AI dünyasındaki gürültüyü eledik, geleceği seçtik. CodeMAN tarafından her gün binlerce içerik arasından süzülen gerçek sinyaller.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
             <Button variant="ghost" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 font-bold gap-2 mr-4" asChild>
               <a href="/">
                 <ArrowLeft className="w-5 h-5" />
                 Podcast'e Dön
               </a>
             </Button>

             <div className="hidden md:flex flex-col items-end gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SİSTEM DURUMU</span>
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> 
                    Anlık Tarama Aktif
                </span>
             </div>
             <Button onClick={fetchItems} disabled={loading} className="w-full sm:w-auto rounded-full px-12 h-16 md:h-20 text-lg font-black bg-slate-900 hover:bg-indigo-600 text-white transition-all duration-500 shadow-2xl shadow-slate-200 group active:scale-95">
              <RefreshCw className={`mr-4 h-6 w-6 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
              GÜNCELLE
            </Button>
          </div>
        </div>

        <Tabs defaultValue="discovery" className="w-full">
          {/* Responsive Tabs Navigation */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 mb-12">
            <div className="w-full xl:w-auto overflow-x-auto pb-4 xl:pb-0 scrollbar-hide">
                <TabsList className="bg-slate-100/80 p-1 rounded-2xl border border-slate-200 h-auto flex min-w-max">
                  <TabsTrigger value="discovery" className="rounded-xl px-5 md:px-8 py-3 md:py-3.5 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all duration-300 font-extrabold text-[11px] md:text-xs uppercase tracking-widest whitespace-nowrap">
                    <Flame className="w-4 h-4 mr-2.5 text-orange-500" /> Küresel Keşifler
                  </TabsTrigger>
                  <TabsTrigger value="signals" className="rounded-xl px-5 md:px-8 py-3 md:py-3.5 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all duration-300 font-extrabold text-[11px] md:text-xs uppercase tracking-widest whitespace-nowrap">
                    <Zap className="w-4 h-4 mr-2.5 text-indigo-600" /> Sinyallerim
                  </TabsTrigger>
                </TabsList>
            </div>

            <div className="flex items-center gap-6 self-end md:self-auto">
                <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">VERİ HAVUZU</span>
                    <div className="flex items-center gap-2">
                        <Newspaper className="w-4 h-4 text-indigo-600" />
                        <span className="text-xl font-black text-slate-900 tracking-tighter">{items.length} Sinyal</span>
                    </div>
                </div>
            </div>
          </div>

          <TabsContent value="discovery" className="mt-0 outline-none animate-in fade-in duration-700">
            <RadarGrid data={discoveredItems} emptyMessage="Küresel keşifler taranıyor..." emptyIcon={Flame} />
          </TabsContent>

          <TabsContent value="signals" className="mt-0 outline-none animate-in fade-in duration-700">
            <RadarGrid data={likedItems} emptyMessage="Henüz sinyal yakalanmadı." emptyIcon={Zap} />
          </TabsContent>
        </Tabs>
        
        {loading && items.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-96 rounded-3xl bg-slate-50 border border-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Career-Focused Interative Newsletter Section */}
        <div id="subscribe" className="mt-32 p-8 md:p-24 bg-slate-900 rounded-[3rem] md:rounded-[4rem] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-16 opacity-10 -rotate-12 scale-150 hidden md:block">
                <Newspaper className="w-64 h-64 text-white" />
            </div>
            
            <div className="max-w-3xl relative z-10">
              {isSubscribed ? (
                <div className="space-y-6 animate-in zoom-in duration-500 text-center md:text-left">
                  <div className="inline-flex items-center gap-3 bg-emerald-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest">
                    <CheckCircle className="w-6 h-6" /> ABONELİK BAŞARILI
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">Radarımıza Hoş Geldiniz!</h2>
                  <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl">
                    İlk bülteniniz bu Pazar 09:00'da gelen kutunuzda olacak. AI dünyasını en ön koltuktan takip etmeye hazır olun.
                  </p>
                </div>
              ) : (
                <div className="space-y-10">
                  <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-white">AI Çağında Önde Kalın.</h2>
                  <p className="text-slate-400 text-lg md:text-2xl font-medium leading-relaxed">
                    Nöral Notlar topluluğuna katılın. Her Pazar, en kritik AI gelişmelerini profesyonel bir bültenle kapınıza getirelim.
                  </p>
                  
                  {/* Form replacement: Direct Control */}
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-grow">
                        <Input 
                          type="email" 
                          placeholder="E-posta adresinizi girin..." 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-16 md:h-20 rounded-full px-8 bg-white/5 border-white/10 text-white placeholder:text-slate-500 text-lg focus:border-indigo-500 focus:ring-indigo-500/20"
                          onKeyDown={(e) => { if(e.key === 'Enter') handleSubscribe(); }}
                        />
                      </div>
                      <Button 
                        size="lg" 
                        onClick={handleSubscribe}
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-white hover:text-slate-900 text-white font-black rounded-full px-12 h-16 md:h-20 text-xl transition-all shadow-2xl disabled:opacity-50"
                      >
                        {isSubmitting ? <RefreshCw className="animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> ABONE OL</>}
                      </Button>
                    </div>
                    
                    <div className="flex items-start gap-3 pl-4">
                      <Checkbox 
                        id="kvkk" 
                        checked={kvkkAccepted}
                        onCheckedChange={(checked) => setKvkkAccepted(checked as boolean)}
                        className="mt-1 border-slate-600 data-[state=checked]:bg-indigo-600"
                      />
                      <div className="text-xs md:text-sm text-slate-500 leading-relaxed cursor-pointer select-none">
                        <Dialog>
                          <DialogTrigger asChild>
                            <span className="underline hover:text-slate-300 cursor-pointer font-bold">KVKK Aydınlatma Metni</span>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-200">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-black text-white">KVKK Aydınlatma Metni</DialogTitle>
                              <DialogDescription className="text-slate-400">
                                Verilerinizin nasıl işlendiği hakkında bilgilendirme.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-4 font-medium">
                              <p><strong>1. Veri Sorumlusu:</strong> Nöral Notlar (Oğuzhan Kalelioğlu) olarak, kişisel verilerinizin güvenliğine önem veriyoruz.</p>
                              <p><strong>2. İşlenen Veriler ve Amaç:</strong> Bülten aboneliği kapsamında sadece "E-posta adresiniz" toplanmaktadır. Bu veri, size haftalık yapay zeka gelişmeleri hakkında bülten göndermek, güncellemelerden haberdar etmek ve topluluk duyurularını iletmek amacıyla işlenir.</p>
                              <p><strong>3. Hukuki Sebep:</strong> Verileriniz, 6698 sayılı KVKK Madde 5/1 uyarınca "Açık Rıza"nıza istinaden işlenmektedir.</p>
                              <p><strong>4. Veri Aktarımı:</strong> E-posta adresiniz, bülten gönderim hizmeti sağlamak amacıyla kullanılan güvenli bulut altyapıları dışında hiçbir üçüncü şahıs veya kurumla paylaşılmaz, satılmaz.</p>
                              <p><strong>5. Saklama Süresi:</strong> Verileriniz, siz abonelikten ayrılana veya bülten hizmeti sona erene kadar sistemlerimizde güvenli olarak saklanır.</p>
                              <p><strong>6. Haklarınız:</strong> İstediğiniz zaman e-posta listesinden ayrılma, verilerinizin silinmesini talep etme veya bilgi alma hakkına sahipsiniz. Bunun için her bültenin altındaki bağlantıyı kullanabilirsiniz.</p>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="secondary" className="w-full bg-slate-800 text-white hover:bg-slate-700" onClick={() => {
                                    setKvkkAccepted(true);
                                    toast.success('Şartları kabul ettiniz.');
                                }}>OKUDUM, ANLADIM</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <span> 'ni okudum, kişisel verilerimin işlenmesini ve tarafıma ticari elektronik ileti gönderilmesini kabul ediyorum.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
