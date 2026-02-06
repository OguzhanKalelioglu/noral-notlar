#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

// --- STRATEJİ: OTORİTE & VİRAL FİLTRESİ ---
// 1. VIP (Tier-1): Sektör devlerinin resmi duyuruları (Sorgusuz sualsiz en taze içerikler)
// 2. Viral (Tier-2): Topluluğun konuştuğu, yüksek etkileşimli "Breaking" içerikler.

const VIP_ACCOUNTS = [
    'OpenAI', 'AnthropicAI', 'GoogleDeepMind', 'xAI', 'MetaAI', 
    'sama', 'karpathy', 'ylecun', 'demishassabis', 'OfficialLoganK'
];

// VIP'lerden son tweetler (Sadece reply olmayanlar)
const VIP_QUERY = `(from:${VIP_ACCOUNTS.join(' OR from:')}) -filter:replies`;

// Geniş kapsamlı "Viral" arama (Keyword kısıtlaması yok, sadece yüksek etkileşim + AI konusu)
// Keyword listesini kaldırdık, sadece ana konular ve yüksek beğeni.
const VIRAL_QUERY = `(AI OR "Artificial Intelligence" OR LLM OR "Machine Learning" OR "Generative AI") min_faves:500 -filter:replies lang:en`;

const CLOUDFLARE_ENV = `CLOUDFLARE_EMAIL=oguzhankalelioglu@icloud.com CLOUDFLARE_API_KEY=491c475f961e2b1ccfcd41bbe9eb35f61627f`;

// Twitter Auth (Mevcut tokenlar)
// .env.bird dosyasından okumayı dene, yoksa hardcoded değerleri kullan
let AUTH_TOKEN = "36459e6b8c6eb9b4227ef414c80df8e31ceba13b";
let CT0 = "47ac88f77d7be823527302678e3235eb16d694a8dd19a2b12f03430cd8199d53777720742c0ffaebdd8f0c96babf3da69459518f9c31d066051954728d65ec092bb030e251c84a0fca7be0b2eabb8c80";

try {
    const envPath = require('path').join(__dirname, '../.env.bird');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, val] = line.split('=');
            if (key && val) {
                if (key.trim() === 'AUTH_TOKEN') AUTH_TOKEN = val.trim();
                if (key.trim() === 'CT0') CT0 = val.trim();
            }
        });
        console.log("🔓 Tokenlar .env.bird dosyasından yüklendi.");
    }
} catch (e) {
    console.log("⚠️ .env.bird okunamadı, varsayılan tokenlar kullanılıyor.");
}

function runCmd(cmd) {
    try {
        // Buffer'ı artırdık, uzun çıktılar için.
        return execSync(cmd, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
    } catch (e) {
        // Hata olsa bile devam et, null dön
        return null;
    }
}

async function main() {
    console.log("📡 Nöral Radar v2: Akıllı Keşif Başlatılıyor...");
    
    // 0. Mevcut özetleri çek (Tekrarı önlemek için)
    const existingResult = runCmd(`${CLOUDFLARE_ENV} npx wrangler d1 execute noral-notlar --remote --command="SELECT summary, twitter_id FROM radar_items WHERE created_at > datetime('now', '-2 days');" --json`);
    let knownIds = new Set();
    let recentSummaries = [];
    
    if (existingResult) {
        try {
            const parsed = JSON.parse(existingResult);
            const rows = parsed[0].results;
            rows.forEach(r => {
                knownIds.add(r.twitter_id);
                recentSummaries.push(r.summary);
            });
        } catch (e) {}
    }

    let allTweets = [];

    // 1. Adım: VIP Taraması
    console.log("🎩 VIP Hesaplar taranıyor...");
    const vipJson = runCmd(`AUTH_TOKEN=${AUTH_TOKEN} CT0=${CT0} bird search '${VIP_QUERY}' --json -n 10`);
    if (vipJson) {
        try {
            const vips = JSON.parse(vipJson);
            console.log(`   ↳ ${vips.length} VIP tweet bulundu.`);
            allTweets.push(...vips);
        } catch (e) {}
    }

    // 2. Adım: Viral/Trend Taraması
    console.log("🔥 Viral Akış taranıyor...");
    const viralJson = runCmd(`AUTH_TOKEN=${AUTH_TOKEN} CT0=${CT0} bird search '${VIRAL_QUERY}' --json -n 15`);
    if (viralJson) {
        try {
            const virals = JSON.parse(viralJson);
            console.log(`   ↳ ${virals.length} Viral tweet bulundu.`);
            allTweets.push(...virals);
        } catch (e) {}
    }

    // Tekilleştirme (ID bazlı)
    const uniqueTweets = [];
    const seen = new Set();
    for (const t of allTweets) {
        if (!seen.has(t.id) && !knownIds.has(t.id)) {
            seen.add(t.id);
            uniqueTweets.push(t);
        }
    }

    console.log(`🔎 Toplam ${uniqueTweets.length} benzersiz içerik analiz edilecek.`);

    // 3. Adım: Gemini ile "EDİTÖRYAL" Filtreleme
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (const tweet of uniqueTweets) {
        // Tweet çok kısaysa veya sadece linkse atla
        if (!tweet.text || tweet.text.length < 30) continue;

        console.log(`🤖 Analiz: @${tweet.author.username} (${tweet.id})`);

        const prompt = `
Sen "Nöral Radar" adlı profesyonel bir teknoloji bülteninin baş editörüsün.
Önünde bir tweet var. Görevin: Bu tweet'in **"Haber Değeri"** taşıyıp taşımadığını belirlemek.

**KRİTERLER:**
1. ✅ **BÜYÜK HABER:** Yeni bir AI modeli (GPT-5, Opus 3.5, Gemini 2 vb.), yeni bir ürün, önemli bir feature, büyük bir yatırım veya stratejik ortaklık duyurusu.
2. ✅ **TEKNİK İLERLEME:** Önemli bir araştırma makalesi, yeni bir açık kaynak kütüphane, benchmark rekoru.
3. ❌ **ÇÖP/GÜRÜLTÜ:** Sadece yorum, spekülasyon, "hype" tweeti, thread tuzağı ("Here is 10 tools..."), kişisel görüş, alakasız konu.

**TWEET:**
Yazar: @${tweet.author.username} (${tweet.author.name})
İçerik: "${tweet.text.replace(/"/g, '\\"')}"

**GÖREV:**
- Eğer içerik **ÇÖP/GÜRÜLTÜ** ise çıktı olarak SADECE "SKIP" yaz.
- Eğer içerik **HABER DEĞERİ** taşıyorsa JSON formatında yanıt ver:
{
  "summary": "Türkçe, profesyonel, haber diliyle 2 cümlelik özet.",
  "category": "Model Launch | Tool | Research | Industry News",
  "score": 85 (Önem derecesi 0-100),
  "is_breaking": true/false
}
`;
        
        await sleep(2000); // Rate limit koruması
        const geminiOutput = runCmd(`gemini "${prompt.replace(/"/g, '\\"')}"`); // Escape quotes

        if (!geminiOutput || geminiOutput.includes("SKIP")) {
            console.log("   🗑️  Eledi (Haber değeri düşük).");
            continue;
        }

        let aiResult;
        try {
            const jsonMatch = geminiOutput.match(/\{.*\}/s);
            if (jsonMatch) {
                aiResult = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("JSON not found");
            }
        } catch (e) {
            console.log("   ⚠️  AI yanıtı anlaşılamadı.");
            continue;
        }

        // Skor kontrolü (Sadece 70+ puanlıları al)
        if (aiResult.score < 70) {
            console.log(`   📉 Skor yetersiz (${aiResult.score}).`);
            continue;
        }

        // Veritabanına Yaz
        const escape = (str) => str ? str.replace(/'/g, "''").replace(/\n/g, " ") : "";
        const sql = `
            INSERT INTO radar_items (twitter_id, author_name, author_username, content, summary, category, url, media_url, source, is_podcast_candidate, created_at)
            VALUES (
                '${tweet.id}',
                '${escape(tweet.author.name)}',
                '${escape(tweet.author.username)}',
                '${escape(tweet.text)}',
                '${escape(aiResult.summary)}',
                '${escape(aiResult.category)}',
                'https://x.com/${tweet.author.username}/status/${tweet.id}',
                '${escape(tweet.media?.[0]?.url || "")}',
                'discovery',
                ${aiResult.is_breaking ? 1 : 0},
                '${tweet.createdAt}'
            )
            ON CONFLICT(twitter_id) DO NOTHING;
        `;

        fs.writeFileSync('temp_discovery_v2.sql', sql);
        runCmd(`${CLOUDFLARE_ENV} npx wrangler d1 execute noral-notlar --remote --file=temp_discovery_v2.sql -y`);
        console.log(`   ✅ EKLENDİ! [${aiResult.category}] ${aiResult.summary.substring(0, 50)}...`);
    }

    if (fs.existsSync('temp_discovery_v2.sql')) fs.unlinkSync('temp_discovery_v2.sql');
    console.log("🏁 Akıllı Tarama Tamamlandı.");
}

main();
