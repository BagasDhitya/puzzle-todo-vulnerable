import { Request, Response } from "express";
import { TodoService } from "../services/todo.service";
import multer from "multer";
import path from "path";
import fs from "fs";

const upload = multer({ dest: "uploads/" }); // insecure: no filename sanitization

export class TodoController {
    private service: TodoService;

    constructor() {
        this.service = new TodoService();
    }

    // vulnerable endpoint: uses raw user input in SQL (SQLi) and returns raw HTML (stored XSS demo)
    public listVulnerable = async (req: Request, res: Response) => {
        try {
            const userId = req.query.userId as string || "1";
            const todos = await this.service.listTodosVulnerable(userId);
            // Respond with raw HTML concatenation -> stored/reflected XSS demonstration
            let html = "<h1>Your todos</h1><ul>";
            for (const t of todos) {
                // no escaping of title/description -> XSS if DB contains script tags
                html += `<li><strong>${t.title}</strong>: ${t.description || ""}</li>`;
            }
            html += "</ul>";
            res.send(html);
        } catch (err) {
            // verbose error messages (information leakage)
            res.status(500).send("Server error: " + (err as Error).message);
        }
    };

    // safer list endpoint (example)
    public listSafe = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.query.userId || 1);
            const todos = await this.service.listTodosSafe(userId);
            res.json(todos);
        } catch (err) {
            res.status(500).json({ error: "internal" });
        }
    };

    public create = async (req: Request, res: Response) => {
        try {
            const { userId, title, description } = req.body;
            // no validation: userId not authenticated - insecure
            const t = await this.service.addTodo(Number(userId), title, description);
            res.json(t);
        } catch (err) {
            res.status(500).json({ error: "can't create" });
        }
    };

    // insecure file upload: accepts any file, saves original filename (path traversal risk)
    public uploadFile = [
        upload.single("file"),
        (req: Request, res: Response) => {
            if (!req.file) return res.status(400).send("No file");
            // insecure: trusting originalname and moving file without sanitization
            const target = path.join("uploads", req.file.originalname);
            try {
                fs.renameSync(req.file.path, target);
            } catch (e) {
                return res.status(500).send("Move failed");
            }
            res.send("Uploaded: " + req.file.originalname);
        }
    ];

    // intentionally dangerous eval endpoint (DO NOT ENABLE on public)
    public evalEndpoint = (req: Request, res: Response) => {
        const code = req.body.code || "";
        try {
            // EXTREMELY DANGEROUS: running user supplied code on server
            // kept for educational demo only; do not use in prod.
            const result = eval(code); // vulnerable
            res.json({ result });
        } catch (e) {
            res.status(500).json({ error: "eval error", message: (e as Error).message });
        }
    };
}
