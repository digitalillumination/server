import express from 'express';
import applyRouters from "./lib/applyRouters";
import routers from './routes';
const app = express();

applyRouters(app, routers);

export default app;