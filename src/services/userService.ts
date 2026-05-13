import {Account} from '../db/models/Account';
import {Source} from "../db/models/Source";

/**
 * Sends the user data to show on the main page.
 */
export const getHomepageData = async (token: string) => {
    const acc = Account.findByToken(token, ['company_name']);

    if (!acc) {
        throw new Error("Invalid session token");
    }

    const sources = Source.findAllByAccount(acc);

    return {
        name: acc.companyName,
        sources: sources.map(source => ({
            name: source.id,
            status: source.isActive ? 'alive' : 'disconnected'
        }))
    };
};