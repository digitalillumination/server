import {Router, routes} from "../lib/decorators/router";
import authMiddleware from "../lib/middlewares/auth";
import Album from "../models/Album";
import {Request, Response} from "express";

@Router
class DevRoutes {
    @routes('delete', '/api/v1/dev/init', {
        middlewares: [authMiddleware()]
    })
    async init(req: Request, res: Response) {
        await Album.deleteMany({});

        res.json({
            success: true
        });
    }

}

export default DevRoutes;