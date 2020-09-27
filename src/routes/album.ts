import {Router, routes} from "../lib/decorators/router";
import {Request, Response} from "express";

@Router
class AlbumRoutes {
    @routes('get', '/api/v1/album')
    async hello(req: Request, res: Response) {
        res.json({
            success: true,
            data: [
                {
                    id: "_dgsdgds",
                    title: "Part I",
                    artist: "Dil",
                    imageUrl: "https://picsum.photos/200.jpg"
                },
                {
                    id: "_dgsdgds",
                    title: "The Real Gangster: Killer of Sunrin",
                    artist: "Dil",
                    imageUrl: "https://picsum.photos/200.jpg"
                },
                {
                    id: "_dgsdgds",
                    title: "Fuck sunrin",
                    artist: "KBO",
                    imageUrl: "https://picsum.photos/200.jpg"
                },
                {
                    id: "_dgsdgds",
                    title: "Kwon Byeong Oak and Cowboys",
                    artist: "KBO",
                    imageUrl: "https://picsum.photos/200.jpg"
                },{
                    id: "_dgsdgds",
                    title: "My Switzerland bank account",
                    artist: "KBO",
                    imageUrl: "https://picsum.photos/200.jpg"
                }

            ]
        });
    }
}

export default AlbumRoutes;