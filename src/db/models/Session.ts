import db from '../connection';
import crypto from 'crypto';

export interface SessionData {
    token: string;
    account_id: number;
    expires_at: string; // Stored as ISO string in SQLite
}

export class Session {
    public readonly token: string;
    public readonly accountId: number;
    public readonly expiresAt: Date;

    constructor(data: SessionData) {
        this.token = data.token;
        this.accountId = data.account_id;
        this.expiresAt = new Date(data.expires_at);
    }

    static createForAccount(accountId: number, daysValid: number = 1): Session {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + daysValid);

        const data: SessionData = {
            token,
            account_id: accountId,
            expires_at: expiresAt.toISOString()
        };

        db.prepare(
            'INSERT INTO sessions (token, account_id, expires_at) VALUES (?, ?, ?)'
        ).run(data.token, data.account_id, data.expires_at);

        return new Session(data);
    }

    static findValid(token: string): boolean {
        const { count } = db.prepare(
            'SELECT COUNT(*) AS count FROM sessions WHERE token = ? AND expires_at > DATETIME(\'now\')'
        ).get(token) as { count: number };

        return count > 0;
    }
}