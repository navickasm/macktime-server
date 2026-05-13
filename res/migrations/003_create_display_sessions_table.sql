CREATE TABLE IF NOT EXISTS display_sessions (
      token TEXT PRIMARY KEY,
      account_id INTEGER NOT NULL,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
);