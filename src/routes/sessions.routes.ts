import {classToClass} from 'class-transformer';
import {Router, Request, Response} from "express";
import AuthenticateUserService from "../services/AuthenticateUserService";

const sessionsRouter = Router();

sessionsRouter.post("/", async (request: Request, response: Response) => {
	const {cpf, password} = request.body;
	const authenticateUser = new AuthenticateUserService();
	const {user, token} = await authenticateUser.execute({
		cpf,
		password,
	});

	const userSecure = classToClass(user)

	return response.json({
		userSecure,
		token
	});
});

export default sessionsRouter;
