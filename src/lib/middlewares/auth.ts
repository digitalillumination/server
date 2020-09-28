import {RequestHandler} from "express";
import {BadRequestError, LoginRequiredError} from "../declarations/error";
import TokenManager from "../../classes/TokenManager";

function authMiddleware(options: {} = {}): RequestHandler {
    return (req, res, next) => {
        if (!req.headers['Authorization'] && typeof req.headers['Authorization'] === 'string') {
            next(LoginRequiredError);
            return;
        }
        const header = req.headers['Authorization'] as string;
        const [type, token] = header.split(' ');
        if (type !== 'Bearer') {
            next(BadRequestError);
            return;
        }

        TokenManager.verifyToken(token)
            .then(user => {
                res.locals.user = user;
                next();
            })
            .catch(next);
    }
}

export default authMiddleware;