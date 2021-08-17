import { classToClass } from "class-transformer";
import { Router, Request, Response } from "express";
import AuthenticateUserService from "../services/AuthenticateUserService";

const sessionsRouter = Router();

/**
 * @openapi
 * /sessions:
 *  post:
 *   summary: Login de usuário
 *   description: Essa rota será responsável por autenticar o login de um usuário.
 *   tags: [
 *    Autenticação
 *   ]
 *   security: [
 *    bearerAuth: []
 *   ]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        cpf:
 *         type: string
 *        password:
 *         type: string
 *   responses:
 *    401:
 *     description: Incorrect CPF/password combination.
 *    200:
 *     description: Retorna um usuário e um token autenticado.
 *     content:
 *      application/json:
 *       schema:
 *        name: User
 *        type: object
 *        properties:
 *         id:
 *          type: string
 *         name:
 *          type: string
 *         isDeliveryman:
 *          type: boolean
 *         created_at:
 *          type: string
 *         updated_at:
 *          type: string
 */

//	Falta implementar o "token" no response 200
sessionsRouter.post("/", async (request: Request, response: Response) => {
	const { cpf, password } = request.body;
	const authenticateUser = new AuthenticateUserService();
	const { user, token } = await authenticateUser.execute({
		cpf,
		password,
	});

	const userSecure = classToClass(user);

	return response.json({
		userSecure,
		token,
	});
});

export default sessionsRouter;
