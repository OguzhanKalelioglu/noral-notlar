#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

const KEYWORDS = ["AI", "LLM", "GPT", "Claude", "Gemini", "OpenClaw", "CLI", "Agent", "Model", "Coding", "Yapay Zeka"];
const AUTH_TOKEN = "36459e6b8c6eb9b4227ef414c80df8e31ceba13b";
const CT0 = "47ac88f77d7be823527302678e3235eb16d694a8dd19a2b12f03430cd8199d53777720742c0ffaebdd8f0c96babf3da69459518f9c31d066051954728d65ec092bb030e251c84a0fca7be0b2eabb8c80";

function runCmd(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    } catch (e) {
        console.error(`Command failed: ${cmd}`, e.message);
        return null;
    }
}

async function main() {
    console.log("🚀 Nöral Depo Sync başlatıldı...");
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // 1. Bird likes çek (Daha fazla çekiyoruz)
    const likesJson = runCmd(`AUTH_TOKEN=${AUTH_TOKEN} CT0=${CT0} bird likes --json`);
    if (!likesJson) return;

    let likes = JSON.parse(likesJson);
    console.log(`🔎 Toplam ${likes.length} beğeni çekildi. Tarih filtresi uygulanıyor...`);

    const filtered = likes.filter(tweet => {
        const tweetDate = new Date(tweet.createdAt);
        const text = tweet.text.toLowerCase();
        const isRecent = tweetDate >= threeMonthsAgo;
        const hasKeywords = KEYWORDS.some(k => text.includes(k.toLowerCase()));
        return isRecent && hasKeywords;
    });

    console.log(`🎯 Son 3 aydan ${filtered.length} AI/Teknoloji tweeti saptandı. İşlem başlıyor...`);

    // Rate limit için yardımcı fonksiyon
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (const tweet of filtered) {
        console.log(`📝 İşleniyor: ${tweet.id} - ${tweet.author.username}`);

        // Rate limit koruması: Her istek öncesi bekle
        await sleep(2500); 

        // 2. Gemini ile özetle (Sadece 1.5-flash kullanarak hızlı ve ucuz olsun)
        const prompt = `Aşağıdaki tweeti analiz et. Eğer AI/Yazılım/Teknoloji ile ilgiliyse:
1. Türkçe kısa bir özet çıkar (maks 2 cümle).
2. Kategorisini belirle (AI, Coding, Agent, News, Tool).
3. JSON formatında ver: {"summary": "...", "category": "..."}
Tweet: "${tweet.text}"`;

        const geminiOutput = runCmd(`gemini "${prompt.replace(/"/g, '\\"')}"`);
        let aiResult = { summary: "", category: "AI" };
        
        try {
            const jsonMatch = geminiOutput.match(/\{.*\}/s);
            if (jsonMatch) {
                aiResult = JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.log("⚠️ AI çıktısı parse edilemedi, ham metin kullanılıyor.");
        }

        // 3. Veritabanına kaydet (SQL injection'a karşı dikkatli - bash üzerinden wrangler d1 execute kullanacağız)
        // SQL string escaping
        const escape = (str) => str ? str.replace(/'/g, "''") : "";
        const CLOUDFLARE_ENV = `CLOUDFLARE_EMAIL=oguzhankalelioglu@icloud.com CLOUDFLARE_API_KEY=491c475f961e2b1ccfcd41bbe9eb35f61627f`;
        
        const sql = `
            INSERT INTO radar_items (twitter_id, author_name, author_username, content, summary, category, url, media_url, source, created_at)
            VALUES (
                '${tweet.id}',
                '${escape(tweet.author.name)}',
                '${escape(tweet.author.username)}',
                '${escape(tweet.text)}',
                '${escape(aiResult.summary)}',
                '${escape(aiResult.category)}',
                'https://x.com/${tweet.author.username}/status/${tweet.id}',
                '${escape(tweet.media?.[0]?.url || "")}',
                'like',
                '${tweet.createdAt}'
            )
            ON CONFLICT(twitter_id) DO UPDATE SET
            summary = excluded.summary,
            category = excluded.category,
            updated_at = CURRENT_TIMESTAMP;
        `;

        fs.writeFileSync('temp_query.sql', sql);
        runCmd(`${CLOUDFLARE_ENV} npx wrangler d1 execute noral-notlar --remote --file=temp_query.sql -y`);
        console.log(`✅ Kaydedildi: ${tweet.id}`);
    }

    if (fs.existsSync('temp_query.sql')) fs.unlinkSync('temp_query.sql');
    console.log("🏁 Sync tamamlandı.");
}

main();
