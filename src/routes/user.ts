import {Router, routes} from "../lib/decorators/router";
import {Request, Response} from "express";
import path from 'path';
import User, {IUser} from "../models/User";
import ExposableError from "../classes/ExposableError";
import TokenManager from "../classes/TokenManager";
import authMiddleware from "../lib/middlewares/auth";
import upload, {uploadPath} from "../lib/declarations/upload";
import {LoginRequiredError, NotFoundError} from "../lib/declarations/error";

@Router
class UserRoutes {
    @routes("post", "/api/v1/user")
    async signUp(req: Request, res: Response) {
        const {userId, password, username} = req.body;
        const user = new User({userId, password, username} as IUser);

        await user.save();
        res.json({
            success: true
        });
    }

    @routes("post", "/api/v1/user/issue")
    async createToken(req: Request, res: Response) {
        const {userId, password} = req.body;
        const user = await User.findOne({userId: userId});
        const error = new ExposableError("아이디가 없거나, 비밀번호가 다릅니다.", "LOGIN_FAILED", 403);
        if (!user || !user.comparePassword(password)) throw error;

        const token = TokenManager.createToken(user);

        res.json({
            success: true,
            data: token
        });
    }

    @routes("put", "/api/v1/user/profile_image", {
        middlewares: [authMiddleware(), upload.single("image")]
    })
    async putProfileImage(req:Request, res: Response) {
        const user = await User.findById(res.locals.user.id);
        if (!user) throw LoginRequiredError;
        if (!req.file.mimetype.match(/^image\//)) {
            throw new ExposableError("이미지 파일을 올려 주세요.", "INVALID_FILE_TYPE_ERROR", 400);
        }

        user.profile_image = req.file.filename;
        await user.save();
        res.json({
            success: true
        });
    }
    @routes("get", "/api/v1/user/:id")
    async getUser(req: Request, res: Response) {
        const user = await User.findById(req.params.id, ["username"]);
        if (!user) throw NotFoundError("유저를");

        const userObj = user.toObject();

        res.json({
            success: true,
            data: userObj
        });
    }
    @routes("get", "/api/v1/user/:id/profile_image")
    async getUserProfile(req: Request, res: Response) {
        const user = await User.findById(req.params.id, ['profile_image']);
        if (!user) throw NotFoundError("유저를");

        const profile_image_path = user.profile_image ? path.join(uploadPath, user.profile_image) : path.resolve(__dirname, '../default_profile.png');

        res.sendFile(profile_image_path);
    }
}

export default UserRoutes;
