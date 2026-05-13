import {Request, Response} from "express";
import * as authService from "../services/authService";
import * as userService from "../services/userService";

export const user = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (typeof token !== 'string') {
        return res.status(400).json({ error: "Token must be provided in headers" });
    }

    const valid = authService.validateToken(token);
    if (!valid) {
        return res.status(401).json({ error: "Invalid session token" });
    }

    try {
        const data = await userService.getHomepageData(token);
        return res.json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}