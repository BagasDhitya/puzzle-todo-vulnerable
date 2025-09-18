import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes";
import { Logger } from "./middlewares/logger.middleware";

export function createApp() {
    const app = express();

    // INSECURE: open CORS to all origins for demo
    app.use(cors({ origin: "*", credentials: true }));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    const logger = new Logger();
    app.use(logger.log);

    app.use("/", routes);

    // verbose error handler (leaks stack)
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error("Unhandled error:", err);
        res.status(500).send("Fatal: " + (err?.stack || err?.message || err));
    });

    return app;
}
