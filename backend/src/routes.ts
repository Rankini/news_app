import { Express } from "express";
import { getArticlesHandler } from "./controller/article.controller";

function routes(app: Express) {
    app.get(
        '/articles',
        getArticlesHandler,
    );
}

export default routes;