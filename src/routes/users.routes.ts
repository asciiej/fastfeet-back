import { Router, Request, Response } from "express";
import { classToClass } from "class-transformer";
import CreateUserService from "../services/CreateUserService";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import ensureIsAdmin from "../middlewares/ensureIsAdmin";
import DeleteUserService from "../services/DeleteUserService";

const usersRouter = Router();

usersRouter.use(ensureAuthenticated);
usersRouter.use(ensureIsAdmin);

/**
 * @openapi
 * /users:
 *  post:
 *   summary: Registro de usuário
 *   description: Essa rota será responsável por registrar um usuário por um administrador.
 *   tags: [
 *    Registro
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
 *        name:
 *         type: string
 *        email:
 *         type: string
 *        cpf:
 *         type: string
 *        password:
 *         type: string
 *        isDeliveryman:
 *         type: boolean
 *   responses:
 *    406:
 *     description: Email address or CPF already in use.
 *    200:
 *     description: Retorna um usuário.
 *     content:
 *      application/json:
 *       schema:
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
usersRouter.post("/", async (request: Request, response: Response) => {
	const { name, email, cpf, password, isDeliveryman } = request.body;
	const createUser = new CreateUserService();
	const user = await createUser.execute({
		name,
		email,
		cpf,
		password,
		isDeliveryman,
	});

	return response.json(classToClass(user));
});

/**
 * @openapi
 * /users:
 *  delete:
 *   summary: Remoção de usuário
 *   description: Essa rota será responsável por remover um usuário por um administrador.
 *   tags: [
 *    Remoção
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
 *        adminID:
 *         type: string
 *        cpf:
 *         type: string
 *   responses:
 *    401:
 *     description: User cannot delete itself.
 *    404:
 *     description: User does not exists.
 *    200:
 *     description: Usuário devidamente deletado pelo administrador.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 */
usersRouter.delete("/", async (request: Request, response: Response) => {
	const adminID = request.user.id;
	const { cpf } = request.body;
	const deleteUser = new DeleteUserService();
	await deleteUser.execute({ adminID, cpf });

	return response.status(200).json({
		message: "User deleted successfully.",
	});
});

export default usersRouter;
