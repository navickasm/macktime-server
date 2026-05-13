import {Account} from '../db/models/Account';
import {Session} from '../db/models/Session';

/**
 * This service handles authentication logic, including:
 * - Verifying user credentials
 * - Creating and validating sessions
 */

/**
 * Authenticates a user by company ID and plain text password. Returns a session token if successful, or null if
 * authentication fails.
 */
export const authenticateUser = async (companyId: number, plainPass: string) => {
    const account = Account.findById(companyId, ["password_hash"]);
    if (!account) return null;

    const isMatch = account.verifyPassword(plainPass);
    if (!isMatch) return null;

    return Session.createForAccount(account.id!, 60);
};

/**
 * Convenience method to determine whether a token is currently valid (exists and not expired). This can be used as
 * middleware in protected routes.
 */
export const validateToken = (token: string): boolean => {
    return Session.findValid(token);
}