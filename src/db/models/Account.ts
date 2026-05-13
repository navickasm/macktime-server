import db from '../connection';
import bcrypt from 'bcrypt';

export interface AccountData {
    id: number;
    company_name: string;
    logo_url?: string;
    password_hash: string;
    created_at?: string;
}

export class Account {
    public readonly id: number;
    public companyName: string;
    public logoUrl?: string;
    private _passwordHash?: string;

    constructor(data: Partial<AccountData>) {
        this.id = data.id!;
        this.companyName = data.company_name || '';
        this.logoUrl = data.logo_url;
        this._passwordHash = data.password_hash;
    }

    static findById(id: number, props: string[] = ['*']): Account | null {
        const columns = props.join(', ');
        const row = db.prepare(`SELECT ${columns} FROM accounts WHERE id = ?`).get(id) as AccountData | undefined;
        return row ? new Account({ ...row, id }) : null;
    }

    static findByToken(token: string, props: string[] = ['*']): Account | null {
        props.push('id'); // Ensure ID is always selected for lazy loading
        const columns = props.join(', ');
        const row = db.prepare(`
        SELECT ${columns} 
        FROM accounts 
        WHERE id = (
            SELECT account_id 
            FROM sessions 
            WHERE token = ? LIMIT 1
        )
    `).get(token) as AccountData | undefined;

        return row ? new Account(row) : null;
    }

    async verifyPassword(password: string): Promise<boolean> {
        await this.lazyLoad('passwordHash'); // Ensure hash is loaded
        if (!this._passwordHash) return false; // Somehow no password set??
        return bcrypt.compare(password, this._passwordHash);
    }

    async lazyLoad(prop: string): Promise<void> {
        if (prop === 'passwordHash' && !this._passwordHash) {
            const row = db.prepare('SELECT password_hash FROM accounts WHERE id = ?').get(this.id) as any;
            this._passwordHash = row?.password_hash;
        }
    }
}