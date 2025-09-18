import { Request, Response } from "express";
import { pool } from "../config/db";
import { JWTUtil } from "../utils/jwt";

// VERY INSECURE: Plaintext passwords in DB and no hashing/pepper/salt
export class AuthController {
    public login = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;
            const q = "SELECT * FROM users WHERE username = $1 AND password = $2";
            const r = await pool.query(q, [username, password]);
            if (r.rowCount === 0) {
                return res.status(401).json({ error: "invalid" });
            }
            const user = r.rows[0];
            // weak predictable payload; secret weak
            const token = JWTUtil.sign({ id: user.id, username: user.username, role: user.role });
            // insecurely set cookie without secure flags
            res.cookie("token", token);
            res.json({ token });
        } catch (err) {
            res.status(500).json({ error: "login failed", detail: (err as Error).message });
        }
    };

    // insecure admin bypass: if query param secret=admin you get admin info
    public adminBypass = async (req: Request, res: Response) => {
        const secret = req.query.secret;
        if (secret === "let-me-in") {
            return res.json({ admin: true, info: "bypass used" });
        }
        res.status(403).json({ admin: false });
    };
}
