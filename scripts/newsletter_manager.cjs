#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const nodemailer = require('nodemailer');

const CLOUDFLARE_ENV = `CLOUDFLARE_EMAIL=oguzhankalelioglu@icloud.com CLOUDFLARE_API_KEY=491c475f961e2b1ccfcd41bbe9eb35f61627f`;

// Internal SMTP Ayarları (TOOLS.md'den)
const transporter = nodemailer.createTransport({
    host: "10.80.1.10",
    port: 25,
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

function runCmd(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    } catch (e) {
        console.error(`Command failed: ${cmd}`, e.message);
        return null;
    }
}

async function getItems() {
    console.log("📥 Bülten için taze haberler çekiliyor...");
    const resultJson = runCmd(`${CLOUDFLARE_ENV} npx wrangler d1 execute noral-notlar --remote --command="SELECT * FROM radar_items WHERE newsletter_sent_at IS NULL ORDER BY created_at DESC LIMIT 10;" --json -y`);
    if (!resultJson) return [];
    
    try {
        const parsed = JSON.parse(resultJson);
        return parsed[0].results;
    } catch (e) {
        return [];
    }
}

async function getSubscribers() {
    const resultJson = runCmd(`${CLOUDFLARE_ENV} npx wrangler d1 execute noral-notlar --remote --command="SELECT email, unsubscribe_token FROM newsletter_subscribers WHERE is_active = TRUE;" --json -y`);
    if (!resultJson) return [];
    
    try {
        const parsed = JSON.parse(resultJson);
        return parsed[0].results;
    } catch (e) {
        return [];
    }
}

function generateHTML(items, unsubscribeToken = "") {
    const itemsHtml = items.map(item => `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 25px; margin-bottom: 25px;">
            <div style="margin-bottom: 15px;">
                <span style="background-color: #4f46e5; color: white; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">${item.category}</span>
                ${item.is_podcast_candidate ? '<span style="background-color: #ecfdf5; color: #059669; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-left: 8px;">🎙 Podcast Adayı</span>' : ''}
            </div>
            <h3 style="margin: 0 0 10px; color: #0f172a; font-size: 20px; font-weight: 800; line-height: 1.2;">${item.author_name}</h3>
            <div style="color: #64748b; font-size: 14px; margin-bottom: 15px; font-weight: 500;">@${item.author_username}</div>
            <p style="color: #1e293b; line-height: 1.6; font-size: 16px; font-weight: 600; margin-bottom: 20px;">${item.summary}</p>
            ${item.media_url ? `<img src="${item.media_url}" style="width: 100%; border-radius: 12px; margin-bottom: 20px; border: 1px solid #f1f5f9;">` : ""}
            <div style="font-style: italic; color: #94a3b8; font-size: 13px; border-left: 3px solid #e2e8f0; padding-left: 15px; margin-bottom: 20px;">
                "${item.content.substring(0, 200)}${item.content.length > 200 ? '...' : ''}"
            </div>
            <a href="${item.url}" style="background-color: #0f172a; color: white; text-decoration: none; padding: 12px 24px; border-radius: 99px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 0.05em;">Haberin Detayı →</a>
        </div>
    `).join("");

    return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nöral Radar Bülteni</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9;">
            <tr>
                <td align="center" style="padding: 40px 10px;">
                    <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);">
                        <!-- Header -->
                        <tr>
                            <td align="left" style="background-color: #0f172a; padding: 40px;">
                                <div style="display: inline-block; background-color: #4f46e5; color: white; padding: 4px 12px; border-radius: 99px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 15px;">📡 Canlı Radar Özeti</div>
                                <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 900; tracking: -0.02em;">Nöral <span style="color: #4f46e5;">Radar.</span></h1>
                                <p style="margin: 10px 0 0; color: #94a3b8; font-size: 18px; font-weight: 500;">AI Dünyasından Seçilmiş Sinyaller</p>
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 35px; color: #475569; font-weight: 500;">
                                    Selam! CodeMAN burada. 🤖 Oğuz ile birlikte AI dünyasındaki gürültüyü eledik ve senin için bu haftanın en kritik haberlerini derledik:
                                </p>
                                
                                ${itemsHtml}

                                <!-- Footer CTAs -->
                                <div style="text-align: center; margin-top: 50px; padding: 30px; background-color: #f8fafc; border-radius: 20px;">
                                    <p style="color: #64748b; font-size: 14px; font-weight: 600; margin-bottom: 15px;">Tüm sinyalleri anlık takip et:</p>
                                    <a href="https://podcast.oguzhankalelioglu.com/radar" style="color: #4f46e5; font-weight: 800; text-decoration: none; font-size: 16px;">Nöral Radar Paneli 📡</a>
                                </div>
                            </td>
                        </tr>
                        <!-- Final Footer -->
                        <tr>
                            <td align="center" style="padding: 40px; background-color: #f8fafc; color: #94a3b8; font-size: 12px; font-weight: 500;">
                                <p>© 2026 Nöral Radar. CodeMAN tarafından otonom olarak hazırlandı. ❤️</p>
                                <p style="margin-top: 15px;">
                                    Abonelikten ayrılmak için <a href="https://podcast.oguzhankalelioglu.com/api/newsletter/unsubscribe?token=${unsubscribeToken}" style="color: #64748b; text-decoration: underline;">buraya tıklayın</a>.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}

async function sendEmail(email, html, subject = "Nöral Radar: Haftalık AI Sinyalleri") {
    try {
        let info = await transporter.sendMail({
            from: '"Nöral Notlar" <codeman@kalelioglu.com.tr>',
            to: email,
            subject: subject,
            html: html,
            replyTo: "oguzhankalelioglu@icloud.com"
        });
        console.log(`✅ Gönderildi: ${email} (${info.messageId})`);
        return true;
    } catch (e) {
        console.error(`❌ Hata (${email}):`, e.message);
        return false;
    }
}

async function main() {
    const mode = process.argv[2]; // "test" or "send"
    
    const items = await getItems();
    if (items.length === 0) {
        console.log("❌ Gönderilecek yeni haber bulunamadı.");
        return;
    }

    if (mode === "test") {
        console.log("🧪 Test bülteni hazırlanıyor (SMTP)...");
        const html = generateHTML(items);
        const success = await sendEmail("oguzhankalelioglu@icloud.com", html, "🧪 TEST: Nöral İstihbarat Bülteni");
        if (success) console.log("📧 Test maili Oğuz'a ulaştı.");
        
    } else if (mode === "send") {
        console.log("🚀 Bülten tüm abonelere gönderiliyor (Internal SMTP)...");
        const subscribers = await getSubscribers();
        console.log(`👥 Toplam ${subscribers.length} abone saptandı.`);

        let sentCount = 0;
        for (const sub of subscribers) {
            const html = generateHTML(items, sub.unsubscribe_token);
            const success = await sendEmail(sub.email, html);
            if (success) sentCount++;
            await new Promise(r => setTimeout(r, 200));
        }

        if (sentCount > 0) {
            console.log("🔄 Veritabanı güncelleniyor (newsletter_sent_at)...");
            const ids = items.map(i => `'${i.twitter_id}'`).join(",");
            runCmd(`${CLOUDFLARE_ENV} npx wrangler d1 execute noral-notlar --remote --command="UPDATE radar_items SET newsletter_sent_at = CURRENT_TIMESTAMP WHERE twitter_id IN (${ids});" -y`);
        }
        
        console.log(`🏁 İşlem tamamlandı. ${sentCount} başarılı gönderim.`);
    } else {
        console.log("Kullanım: ./newsletter_manager.cjs [test|send]");
    }
}

main();
