import { Router } from "express";
import { TodoController } from "./controllers/todo.controller";
import { AuthController } from "./controllers/auth.controller";

const router = Router();
const todoCtrl = new TodoController();
const authCtrl = new AuthController();

router.get("/todos/vuln", todoCtrl.listVulnerable);
router.get("/todos/safe", todoCtrl.listSafe);
router.post("/todos", todoCtrl.create);
router.post("/upload", todoCtrl.uploadFile);
router.post("/eval", todoCtrl.evalEndpoint);

router.post("/auth/login", authCtrl.login);
router.get("/admin/bypass", authCtrl.adminBypass);

export default router;
