import { Request, Response } from 'express';
import { Router, routes } from '../lib/decorators/router'

@Router
class PlaylistRouter {
    @routes("post", "/api/v1/playlist")
    createPlaylist(req: Request, res: Response) {
        const {name, photo} = req.body;
    }
}