#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

const CLOUDFLARE_ENV = `CLOUDFLARE_EMAIL=oguzhankalelioglu@icloud.com CLOUDFLARE_API_KEY=491c475f961e2b1ccfcd41bbe9eb35f61627f`;
const WORKER_URL = "https://noral-notlar.oguzhankalelioglu.workers.dev";
const SYNC_TOKEN = "noral-radar-sync-2026";

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
            </div>
            <h3 style="margin: 0 0 10px; color: #0f172a; font-size: 20px; font-weight: 800;">${item.author_name}</h3>
            <p style="color: #1e293b; line-height: 1.6; font-size: 16px; font-weight: 600; margin-bottom: 20px;">${item.summary}</p>
            ${item.media_url ? `<img src="${item.media_url}" style="width: 100%; border-radius: 12px; margin-bottom: 20px;">` : ""}
            <a href="${item.url}" style="background-color: #0f172a; color: white; text-decoration: none; padding: 12px 24px; border-radius: 99px; font-weight: 800; font-size: 14px; display: inline-block;">İstihbarat Detayı →</a>
        </div>
    `).join("");

    return `
    <!DOCTYPE html>
    <html lang="tr">
    <head><meta charset="UTF-8"><title>Nöral Radar Bülteni</title></head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: sans-serif; color: #1e293b;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9;">
            <tr>
                <td align="center" style="padding: 40px 10px;">
                    <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: white; border-radius: 24px; overflow: hidden;">
                        <tr>
                            <td align="left" style="background-color: #0f172a; padding: 40px;">
                                <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 900;">Nöral <span style="color: #4f46e5;">Radar.</span></h1>
                                <p style="margin: 10px 0 0; color: #94a3b8; font-size: 18px;">Haftalık AI Raporu</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px;">
                                ${itemsHtml}
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 40px; background-color: #f8fafc; color: #94a3b8; font-size: 12px;">
                                <p>© 2026 Nöral Radar. Cloudflare otonom bülten motoru.</p>
                                <p><a href="https://podcast.oguzhankalelioglu.com/api/newsletter/unsubscribe?token=${unsubscribeToken}" style="color: #64748b;">Abonelikten ayrıl</a></p>
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

async function sendEmailViaWorker(email, html, subject = "Haftalık AI İstihbaratı: Nöral Radar") {
    try {
        const response = await fetch(`${WORKER_URL}/api/newsletter/broadcast`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Sync-Token": SYNC_TOKEN
            },
            body: JSON.stringify({ to: email, subject, html })
        });
        const res = await response.json();
        if (response.ok) {
            console.log(`✅ Gönderildi (Bulut): ${email}`);
            return true;
        } else {
            console.error(`❌ Hata (${email}):`, res.error);
            return false;
        }
    } catch (e) {
        console.error(`❌ Fetch Hata:`, e.message);
        return false;
    }
}

async function main() {
    const mode = process.argv[2];
    const items = await getItems();
    if (items.length === 0) { console.log("❌ Yeni haber yok."); return; }

    if (mode === "test") {
        console.log("🧪 Bulut Testi Başlatılıyor...");
        const html = generateHTML(items);
        await sendEmailViaWorker("oguzhankalelioglu@icloud.com", html, "🧪 BULUT TEST: Nöral Radar Bülteni");
    } else if (mode === "send") {
        const subscribers = await getSubscribers();
        for (const sub of subscribers) {
            const html = generateHTML(items, sub.unsubscribe_token);
            await sendEmailViaWorker(sub.email, html);
            await new Promise(r => setTimeout(r, 300));
        }
    }
}

main();
