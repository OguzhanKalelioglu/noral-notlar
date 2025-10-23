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
}
