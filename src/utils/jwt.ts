import jwt from "jsonwebtoken";

const WEAK_SECRET = process.env.JWT_SECRET || "super-secret-key"; // intentionally weak & hardcoded default

export class JWTUtil {
    static sign(payload: object) {
        // very short expiration to simulate tokens (but secret weak)
        return jwt.sign(payload, WEAK_SECRET, { expiresIn: "1h" });
    }

    static verify(token: string) {
        return jwt.verify(token, WEAK_SECRET);
    }
}
