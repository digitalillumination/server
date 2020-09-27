import {Router, routes} from "../lib/decorators/router";
import {Request, Response} from "express";
import User, {IUser} from "../models/User";
import ExposableError from "../classes/ExposableError";
import TokenManager from "../classes/TokenManager";

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
}

export default UserRoutes;
