CREATE TABLE IF NOT EXISTS sources (
    id TEXT NOT NULL,
    account_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT 0,
    PRIMARY KEY (id, account_id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);