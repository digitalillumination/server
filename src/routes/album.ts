import {Router, routes} from "../lib/decorators/router";
import {Request, Response} from "express";
import fs from 'fs';
import authMiddleware from "../lib/middlewares/auth";
import upload from "../lib/declarations/upload";
import {BadRequestError} from "../lib/declarations/error";
import Album from "../models/Album";
import {isValidObjectId} from "mongoose";

@Router
class AlbumRoutes {
    @routes('post', '/api/v1/album', {
        middlewares: [authMiddleware(), upload.array('songs')]
    })
    async postAlbum(req: Request, res: Response) {
        try {
            const {albumName, kind, title, albumImageId} = req.body;
            if (!albumName || !kind || (kind === "album" && !title) || !req.files || !req.files.length || !Array.isArray(req.files) || !isValidObjectId(albumImageId)) throw BadRequestError;

            for (const file of req.files) {
                if (!file.mimetype.match(/audio\/*/)) throw BadRequestError;
            }

            const album = new Album();
            album.title = albumName;
            album.type = kind;
            album.image = albumImageId;
            album.by = res.locals.user.id;

            if (kind === "single") {
                if (req.files.length > 1) throw BadRequestError;
                album.songs = [
                    req.files[0].filename
                ];
                album.songTitles = [
                    albumName as string
                ]
            } else if (kind === "album") {
                if (req.files.length !== title.length) throw BadRequestError;
                album.songs = req.files.map(file => file.filename);
                album.songTitles = title;
            } else {
                throw BadRequestError;
            }

            await album.save();

            res.json({
                success: true,
                data: {
                    albumId: album._id
                }
            });
        } catch (e) {
            const files = Array.isArray(req.files) ? req.files : Object.values(req.files);

            for (const file of files) {
                fs.unlinkSync((file as Express.Multer.File).path);
            }

            throw e;
        }
    }
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