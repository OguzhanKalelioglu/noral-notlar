#!/usr/bin/env node

const { execSync } = require('child_process');
const nodemailer = require('nodemailer');

const CLOUDFLARE_ENV = `CLOUDFLARE_EMAIL=oguzhankalelioglu@icloud.com CLOUDFLARE_API_KEY=491c475f961e2b1ccfcd41bbe9eb35f61627f`;

// Internal SMTP Ayarları (10.80.1.10)
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

async function getNewSubscribers() {
    const resultJson = runCmd(`${CLOUDFLARE_ENV} npx wrangler d1 execute noral-notlar --remote --command="SELECT id, email, unsubscribe_token FROM newsletter_subscribers WHERE welcome_email_sent_at IS NULL AND is_active = TRUE;" --json -y`);
    if (!resultJson) return [];
    
    try {
        const parsed = JSON.parse(resultJson);
        return parsed[0].results;
    } catch (e) {
        return [];
    }
}

function generateWelcomeHTML(unsubscribeToken) {
    return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <title>Aileye Hoş Geldin!</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center" style="padding: 40px 10px;">
                    <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);">
                        <tr>
                            <td align="center" style="background-color: #0f172a; padding: 50px 40px;">
                                <h1 style="margin: 0; color: white; font-size: 36px; font-weight: 900; letter-spacing: -0.02em;">Aramıza <span style="color: #4f46e5;">Hoş Geldin!</span> 🚀</h1>
                                <p style="margin: 15px 0 0; color: #94a3b8; font-size: 18px;">Nöral Radar Topluluğu</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 50px 40px;">
                                <p style="font-size: 16px; line-height: 1.7; margin-bottom: 25px; color: #334155;">
                                    Selam! Ben <strong>CodeMAN</strong>, Oğuzhan'ın otonom yapay zeka asistanıyım. 🤖
                                </p>
                                <p style="font-size: 16px; line-height: 1.7; margin-bottom: 25px; color: #334155;">
                                    Nöral Radar bültenine abone olduğun için çok heyecanlıyım! Artık yapay zeka dünyasının gürültüsü içinde kaybolmayacaksın.
                                </p>
                                <div style="background-color: #f1f5f9; border-left: 4px solid #4f46e5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                                    <h3 style="margin: 0 0 10px; color: #0f172a; font-size: 18px;">📅 Ne Zaman Beklemelisin?</h3>
                                    <p style="margin: 0; color: #475569;">Her <strong>Pazar sabahı 09:00'da</strong>, haftanın en kritik AI gelişmelerini ve benim özel keşiflerimi içeren "Nöral Radar" raporunu posta kutuna ışınlayacağım.</p>
                                </div>
                                <p style="font-size: 16px; line-height: 1.7; margin-bottom: 0; color: #334155;">
                                    Şimdilik canlı sinyalleri takip etmek istersen, radarımız her zaman açık:
                                </p>
                                <div style="text-align: center; margin-top: 30px;">
                                    <a href="https://podcast.oguzhankalelioglu.com/radar" style="background-color: #4f46e5; color: white; text-decoration: none; padding: 16px 32px; border-radius: 99px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">RADAR'A GİT 📡</a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 30px; background-color: #f8fafc; color: #94a3b8; font-size: 12px;">
                                <p>© 2026 Nöral Notlar. CodeMAN tarafından otonom yönetilmektedir.</p>
                                <p><a href="https://podcast.oguzhankalelioglu.com/api/newsletter/unsubscribe?token=${unsubscribeToken}" style="color: #64748b; text-decoration: underline;">Abonelikten ayrıl</a></p>
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

async function main() {
    console.log("📨 Hoşgeldin mailleri kontrol ediliyor...");
    const subscribers = await getNewSubscribers();
    
    if (subscribers.length === 0) {
        console.log("✅ Yeni abone yok.");
        return;
    }

    console.log(`🎉 ${subscribers.length} yeni abone bulundu! Gönderim başlıyor...`);

    let sentCount = 0;
    const sentIds = [];

    for (const sub of subscribers) {
        try {
            await transporter.sendMail({
                from: '"Nöral Notlar" <codeman@kalelioglu.com.tr>',
                to: sub.email,
                subject: "Aileye Hoş Geldin! 🚀 Nöral Radar",
                html: generateWelcomeHTML(sub.unsubscribe_token),
                replyTo: "oguzhankalelioglu@icloud.com"
            });
            console.log(`✅ Gönderildi: ${sub.email}`);
            sentIds.push(sub.id);
            sentCount++;
            await new Promise(r => setTimeout(r, 500)); // Rate limit
        } catch (e) {
            console.error(`❌ Hata (${sub.email}):`, e.message);
        }
    }

    if (sentIds.length > 0) {
        console.log("🔄 Veritabanı güncelleniyor (welcome_email_sent_at)...");
        const ids = sentIds.join(",");
        runCmd(`${CLOUDFLARE_ENV} npx wrangler d1 execute noral-notlar --remote --command="UPDATE newsletter_subscribers SET welcome_email_sent_at = CURRENT_TIMESTAMP WHERE id IN (${ids});" -y`);
    }

    console.log(`🏁 İşlem tamamlandı. ${sentCount} hoşgeldin maili gönderildi.`);
}

main();
