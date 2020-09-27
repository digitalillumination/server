import express from 'express';
import applyRouters from "./lib/applyRouters";
import routers from './routes';
import errorRequestHandler from "./lib/errorRequestHandler";
const app = express();

app.use(express.json());
applyRouters(app, routers);

app.use(errorRequestHandler)
export default app;