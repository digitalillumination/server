import express from 'express';
import cors from 'cors';
import applyRouters from "./lib/applyRouters";
import routers from './routes';
import errorRequestHandler from "./lib/errorRequestHandler";
const app = express();

app.use(cors({
    origin: ["https://theil.doyeong.dev", "http://theil.doyeong.dev"]
}))
app.use(express.json());
applyRouters(app, routers);

app.use(errorRequestHandler)
export default app;