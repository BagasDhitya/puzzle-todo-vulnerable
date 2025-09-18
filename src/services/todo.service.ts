import { TodoRepository } from "../repositories/todo.repository";

export class TodoService {
    private repo: TodoRepository;

    constructor() {
        this.repo = new TodoRepository();
    }

    // intentionally accept userId as string to demonstrate SQLi case
    public async listTodosVulnerable(userId: string) {
        return this.repo.findAllByUserIdRaw(userId);
    }

    public async listTodosSafe(userId: number) {
        return this.repo.findAllByUserIdSafe(userId);
    }

    public async addTodo(userId: number, title: string, description?: string) {
        // no validation / no sanitization => XSS stored possible via description
        return this.repo.create(userId, title, description);
    }
}
