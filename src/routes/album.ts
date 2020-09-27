import {Router, routes} from "../lib/decorators/router";
import {Request, Response} from "express";

@Router
class AlbumRoutes {
    @routes('get', '/')
    hello(req: Request, res: Response) {
        res.json({hello: 'world'});
    }
}

export default AlbumRoutes;