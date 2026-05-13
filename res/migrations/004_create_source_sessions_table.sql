CREATE TABLE IF NOT EXISTS source_sessions (
    account_id INTEGER NOT NULL,
    source_id TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (source_id, account_id) REFERENCES sources(id, account_id)
);