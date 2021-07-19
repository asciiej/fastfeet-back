import {Router} from "express";
import sessionsRouter from "./sessions.routes";
import usersRouter from "./users.routes";
import deliveriesRouter from "./deliveries.routes";
import deliverymanRouter from "./deliveryman.routes";

const routes = Router();

routes.use("/sessions", sessionsRouter);
routes.use("/users", usersRouter);
routes.use("/deliveries", deliveriesRouter);
routes.use("/deliveryman", deliverymanRouter);

export default routes;
