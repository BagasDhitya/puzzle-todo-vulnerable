import { pool } from "../config/db";

export interface TodoRow {
    id: number;
    user_id: number;
    title: string;
    description?: string;
    created_at: string;
}

export class TodoRepository {
    // VULNERABILITY: SQL concatenation (SQL Injection)
    public async findAllByUserIdRaw(userId: string): Promise<TodoRow[]> {
        // userId comes as string directly concatenated -> SQLi vulnerable
        const q = `SELECT * FROM todos WHERE user_id = ${userId} ORDER BY created_at DESC`;
        const res = await pool.query(q);
        return res.rows;
    }

    // safer alternative (not used in vulnerable endpoints)
    public async findAllByUserIdSafe(userId: number): Promise<TodoRow[]> {
        const res = await pool.query("SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
        return res.rows;
    }

    public async create(userId: number, title: string, description?: string) {
        const res = await pool.query(
            "INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
            [userId, title, description]
        );
        return res.rows[0];
    }
}
