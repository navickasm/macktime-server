import db from '../connection';
import { Account } from './Account';

export interface SourceData {
    id: string;
    account_id: number;
    is_active: number; // 0-false, 1-true
}

export class Source {
    public readonly id: string;
    public readonly accountId: number;
    public isActive: boolean;

    constructor(data: SourceData) {
        this.id = data.id;
        this.accountId = data.account_id;
        this.isActive = data.is_active === 1;
    }

    static findById(id: string): Source | null {
        const row = db.prepare('SELECT * FROM sources WHERE id = ?').get(id) as SourceData | undefined;
        return row ? new Source(row) : null;
    }

    static findAllByAccount(account: Account): Source[] {
        const rows = db.prepare('SELECT id, is_active FROM sources WHERE account_id = ?').all(account.id) as SourceData[];

        return rows.map(row => {
            row.account_id = account.id;
            return new Source(row);
        });
    }
}