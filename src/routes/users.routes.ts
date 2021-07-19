import {Router, Request, Response} from "express";
import CreateUserService from "../services/CreateUserService";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import ensureIsAdmin from "../middlewares/ensureIsAdmin";
import {classToClass} from "class-transformer";
import DeleteUserService from "../services/DeleteUserService";

const usersRouter = Router();

usersRouter.use(ensureAuthenticated);
usersRouter.use(ensureIsAdmin);

usersRouter.post("/", async (request: Request, response: Response) => {
	const {name, email, cpf, password, isDeliveryman} = request.body;
	const createUser = new CreateUserService();
	const user = await createUser.execute({
		name: name,
		email: email,
		cpf: cpf,
		password: password,
		isDeliveryman: isDeliveryman
	});
	
	return response.json(
		classToClass(user)
	);
});

usersRouter.delete("/", async (request: Request, response: Response) =>{
	const adminID = request.user.id;
	const {cpf} = request.body;
	const deleteUser = new DeleteUserService();
	await deleteUser.execute({adminID, cpf});

	return response.status(200).json({
		message: "User deleted successfully."
	});
});

export default usersRouter;