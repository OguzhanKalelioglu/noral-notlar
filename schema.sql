-- Newsletter subscribers table for Noral Notlar
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    unsubscribe_token TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_email ON newsletter_subscribers(email);

-- Index for active subscribers
CREATE INDEX IF NOT EXISTS idx_active ON newsletter_subscribers(is_active);