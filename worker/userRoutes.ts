import { Hono } from "hono";
import { Env } from './core-utils';

export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Add more routes like this. **DO NOT MODIFY CORS OR OVERRIDE ERROR HANDLERS**
    app.get('/api/test', (c) => c.json({ success: true, data: { name: 'this works' }}));

    // Newsletter subscription endpoints
    app.post('/api/newsletter/subscribe', async (c) => {
        try {
            const { email } = await c.req.json();

            if (!email || !email.includes('@')) {
                return c.json({ success: false, error: 'Geçerli bir e-posta adresi girin' }, 400);
            }

            // Check if already subscribed
            const existingSubscriber = await c.env.DB.prepare(
                'SELECT id FROM newsletter_subscribers WHERE email = ? AND is_active = TRUE'
            ).bind(email).first();

            if (existingSubscriber) {
                return c.json({ success: false, error: 'Bu e-posta adresi zaten abone' }, 400);
            }

            // Generate unsubscribe token
            const unsubscribeToken = crypto.randomUUID();

            // Add new subscriber
            await c.env.DB.prepare(`
                INSERT INTO newsletter_subscribers (email, unsubscribe_token)
                VALUES (?, ?)
            `).bind(email, unsubscribeToken).run();

            return c.json({
                success: true,
                message: 'Aboneliğiniz başarıyla oluşturuldu!',
                data: { unsubscribeToken }
            });
        } catch (error) {
            console.error('[NEWSLETTER SUBSCRIBE] Error:', error);
            return c.json({ success: false, error: 'Bir hata oluştu, lütfen tekrar deneyin' }, 500);
        }
    });

    app.get('/api/newsletter/subscribers', async (c) => {
        try {
            const result = await c.env.DB.prepare(`
                SELECT id, email, subscribed_at, is_active
                FROM newsletter_subscribers
                WHERE is_active = TRUE
                ORDER BY subscribed_at DESC
            `).all();

            return c.json({
                success: true,
                data: {
                    subscribers: result.results,
                    count: result.results.length
                }
            });
        } catch (error) {
            console.error('[NEWSLETTER GET SUBSCRIBERS] Error:', error);
            return c.json({ success: false, error: 'Aboneler alınamadı' }, 500);
        }
    });

    app.post('/api/newsletter/unsubscribe', async (c) => {
        try {
            const { token } = await c.req.json();

            if (!token) {
                return c.json({ success: false, error: 'Geçersiz işlem tokenı' }, 400);
            }

            // Update subscriber status to inactive
            const result = await c.env.DB.prepare(`
                UPDATE newsletter_subscribers
                SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
                WHERE unsubscribe_token = ?
            `).bind(token).run();

            if (result.changes === 0) {
                return c.json({ success: false, error: 'Geçersiz veya kullanılmış token' }, 400);
            }

            return c.json({
                success: true,
                message: 'Aboneliğiniz başarıyla iptal edildi'
            });
        } catch (error) {
            console.error('[NEWSLETTER UNSUBSCRIBE] Error:', error);
            return c.json({ success: false, error: 'Abonelik iptali başarısız' }, 500);
        }
    });

    // Radar (Tech News) Endpoints
    app.get('/api/radar', async (c) => {
        try {
            const { category, podcast } = c.req.query();
            
            let query = `SELECT * FROM radar_items WHERE 1=1`;
            const params = [];

            if (category) {
                query += ` AND category = ?`;
                params.push(category);
            }

            if (podcast === 'true') {
                query += ` AND is_podcast_candidate = TRUE`;
            }

            query += ` ORDER BY created_at DESC LIMIT 50`;

            const result = await c.env.DB.prepare(query).bind(...params).all();

            return c.json({
                success: true,
                data: result.results
            });
        } catch (error) {
            console.error('[RADAR GET] Error:', error);
            return c.json({ success: false, error: 'Radar verileri alınamadı' }, 500);
        }
    });

    app.post('/api/radar/sync', async (c) => {
        try {
            const secret = c.req.header('X-Sync-Token');
            // Basit güvenlik: Hardcoded token. Üretimde env variable olmalı.
            if (secret !== 'noral-radar-sync-2026') {
                return c.json({ success: false, error: 'Unauthorized' }, 401);
            }

            const items = await c.req.json();
            
            if (!Array.isArray(items)) {
                return c.json({ success: false, error: 'Liste bekleniyor' }, 400);
            }

            const results = [];
            for (const item of items) {
                const result = await c.env.DB.prepare(`
                    INSERT INTO radar_items (twitter_id, author_name, author_username, content, summary, category, url, media_url, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(twitter_id) DO UPDATE SET
                    summary = excluded.summary,
                    category = excluded.category,
                    updated_at = CURRENT_TIMESTAMP
                `).bind(
                    item.twitter_id,
                    item.author_name,
                    item.author_username,
                    item.content,
                    item.summary,
                    item.category || 'AI',
                    item.url,
                    item.media_url,
                    item.created_at || new Date().toISOString()
                ).run();
                results.push(result);
            }

            return c.json({
                success: true,
                message: `${results.length} öğe işlendi`,
            });
        } catch (error) {
             console.error('[RADAR SYNC] Error:', error);
             return c.json({ success: false, error: 'Sync hatası' }, 500);
        }
    });

    // Neural Vault Endpoints
    app.get('/api/vault', async (c) => {
        try {
            const result = await c.env.DB.prepare('SELECT * FROM neural_vault ORDER BY created_at DESC').all();
            return c.json({ success: true, data: result.results });
        } catch (error) {
            console.error('[VAULT GET] Error:', error);
            return c.json({ success: false, error: 'Vault verileri alınamadı' }, 500);
        }
    });

    app.post('/api/vault', async (c) => {
        try {
            const body = await c.req.json();
            const { id, content, summary, category, url, media_url } = body;

            if (!id || !content) {
                return c.json({ success: false, error: 'ID ve Content zorunludur' }, 400);
            }

            const result = await c.env.DB.prepare(`
                INSERT INTO neural_vault (id, content, summary, category, url, media_url)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                content = excluded.content,
                summary = excluded.summary,
                category = excluded.category,
                url = excluded.url,
                media_url = excluded.media_url
            `).bind(id, content, summary, category, url, media_url).run();

            return c.json({ success: true, message: 'Vault verisi eklendi/güncellendi', data: result });
        } catch (error) {
            console.error('[VAULT POST] Error:', error);
            return c.json({ success: false, error: 'Vault verisi eklenemedi' }, 500);
        }
    });

    // Cloudflare Email Dispatcher (Original method - kept for reference)
    app.post('/api/admin/send-newsletter', async (c) => {
        return c.json({ success: false, error: 'Bu metod yerine /api/newsletter/broadcast kullanın' }, 400);
    });

    // MailChannels Integration (For broad newsletter sending)
    app.post('/api/newsletter/broadcast', async (c) => {
        try {
            const secret = c.req.header('X-Sync-Token');
            if (secret !== 'noral-radar-sync-2026') {
                return c.json({ success: false, error: 'Unauthorized' }, 401);
            }

            const { to, subject, html } = await c.req.json();

            if (!to || !subject || !html) {
                return c.json({ success: false, error: 'Eksik veri' }, 400);
            }

            const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    personalizations: [{ to: [{ email: to }] }],
                    from: { email: 'codeman@kalelioglu.com.tr', name: 'Nöral Notlar' },
                    subject: subject,
                    content: [{ type: 'text/html', value: html }],
                }),
            });

            if (response.ok) {
                return c.json({ success: true });
            } else {
                const err = await response.text();
                return c.json({ success: false, error: err }, 500);
            }
        } catch (error: any) {
            return c.json({ success: false, error: error.message }, 500);
        }
    });
}
