import {Router, routes} from "../lib/decorators/router";
import {Request, Response} from "express";
import fs from 'fs';
import path from 'path';
import authMiddleware from "../lib/middlewares/auth";
import upload, {uploadPath} from "../lib/declarations/upload";
import {BadRequestError, NotFoundError} from "../lib/declarations/error";
import Album from "../models/Album";
import {isValidObjectId} from "mongoose";
import {UserDocument} from "../models/User";

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
    async getAlbums(req: Request, res: Response) {
        const albums = await Album.find().populate("by", ["username"]);
        res.json({
            success: true,
            data: albums.map(album => ({...album.toObject(), by: undefined, artist: (album.by as UserDocument).username}))
        });
    }
    @routes('get', '/api/v1/album/:id')
    async getAlbum(req: Request, res: Response) {
        const id = req.params.id;
        const album = await this.getAlbumDocument(id);

        res.json({
            success: true,
            data: album
        })
    }
    @routes('get', '/api/v1/album/:id/:number/music')
    async getAlbumMusic(req: Request, res: Response) {
        const {id, number} = req.params;
        if (Number.isNaN(number)) throw BadRequestError;
        const index = parseInt(number, 10) - 1;

        const album = await this.getAlbumDocument(id);
        if (!album.songs[index]) throw NotFoundError("곡을");

        res.sendFile(path.join(uploadPath, album.songs[index]));
    }
    @routes('get', '/api/v1/album/:id/:number')
    async getAlbumMusicTitle(req: Request, res: Response) {
        const {id, number} = req.params;
        if (Number.isNaN(number)) throw BadRequestError;
        const index = parseInt(number, 10) - 1;

        const album = await this.getAlbumDocument(id);
        if (!album.songs[index]) throw NotFoundError("곡을");

        res.json({
            success: true,
            data: {
                albumId: album._id,
                albumTitle: album.title,
                title: album.songTitles[index],
                by: album.by
            }
        })

    }

    private async getAlbumDocument(id: any) {
        if (!isValidObjectId(id)) throw BadRequestError;
        const album = await Album.findById(id).populate("by", ["username"]);
        if (!album) throw NotFoundError("앨범을");

        return album;
    }
}

export default AlbumRoutes;