import { Request, Response } from 'express';
import * as authService from '../services/authService';

/**
 * Login requests must contain a JSON body with the following structure:
 * { "companyId": "number", "password": "string" }
 */
export const login = async (req: Request, res: Response) => {
    const { companyId, password } = req.body;

    try {
        const session = await authService.authenticateUser(companyId, password);

        if (session) {
            return res.status(200).json({ message: "Login successful", token: session.token });
        } else {
            return res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const validate = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (typeof token !== 'string') {
        return res.status(400).json({ error: "Token must be provided in headers" });
    }

    return res.json({ status: authService.validateToken(token) ? "authorized" : "unauthorized" });
}