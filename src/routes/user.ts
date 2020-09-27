import {Router, routes} from "../lib/decorators/router";
import {Request, Response} from "express";
import User, {IUser} from "../models/User";

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
}

export default UserRoutes;
