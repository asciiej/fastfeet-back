import { classToClass } from "class-transformer";
import { Request, Response, Router } from "express";
import multer from "multer";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import CreateDeliveryService from "../services/CreateDeliveryService";
import DeleteDeliveryService from "../services/DeleteDeliveryService";
import UpdateDeliveryAvatarService from "../services/UpdateDeliveryAvatarService";
import ensureIsAdmin from "../middlewares/ensureIsAdmin";
import uploadConfig from "../config/upload";
import AppError from "../errors/AppError";

const deliveriesRouter = Router();
const upload = multer(uploadConfig);

deliveriesRouter.use(ensureAuthenticated);
deliveriesRouter.use(ensureIsAdmin);

/**
 * @openapi
 * /deliveries:
 *  post:
 *   summary: Registro de entrega
 *   description: Essa rota será responsável por registrar uma entrega por um administrador.
 *   tags: [
 *    Registro,
 *    Entregas
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
 *        deliveryman_id:
 *         type: string
 *        product:
 *         type: string
 *        address:
 *         type: string
 *        postal_code:
 *         type: string
 *        neighborhood:
 *         type: string
 *        city:
 *         type: string
 *        state:
 *         type: string
 *        signature_id:
 *         type: string
 *   responses:
 *    401:
 *     description: Deliveryman is invalid or this user is not a deliveryman.
 *    200:
 *     description: Entrega registrada por um administrador.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         id:
 *          type: string
 *         deliveryman_id:
 *          type: string
 *         product:
 *          type: string
 *         canceled_at:
 *          type: string
 *         signature_id:
 *          type: string
 *         start_date:
 *          type: string
 *         end_date:
 *          type: string
 *         created_at:
 *          type: string
 *         updated_at:
 *          type: string
 */
deliveriesRouter.post("/", async (request: Request, response: Response) => {
	const {
		deliveryman_id,
		product,
		address,
		postal_code,
		neighborhood,
		city,
		state,
		signature_id,
	} = request.body;
	const createDelivery = new CreateDeliveryService();
	const delivery = await createDelivery.execute({
		deliveryman_id,
		product,
		address,
		postal_code,
		neighborhood,
		city,
		state,
		signature_id,
	});

	return response.json(classToClass(delivery));
});

/**
 * @openapi
 * /deliveries:
 *  delete:
 *   summary: Remoção de entrega
 *   description: Essa rota será responsável por remover uma entrega por um administrador.
 *   tags: [
 *    Remoção,
 *    Entregas
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
 *        id:
 *         type: string
 *   responses:
 *    404:
 *     description: Delivery does not exists.
 *    200:
 *     description: Entrega devidamente deletada pelo administrador.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 */
deliveriesRouter.delete("/", async (request: Request, response: Response) => {
	const { id } = request.body;
	const deleteDeliveryService = new DeleteDeliveryService();
	await deleteDeliveryService.execute({ id });

	return response.json({
		message: "Delivery deleted.",
	});
});

/**
 * @openapi
 * /deliveries/avatar:
 *  patch:
 *   summary: Alteração do avatar
 *   description: Essa rota será responsável por alterar o avatar de uma entrega por um administrador.
 *   tags: [
 *    Avatar,
 *    Entregas
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
 *        avatar:
 *         type: string
 *   responses:
 *    404:
 *     description: Delivery does not exists or File not found.
 *    200:
 *     description: Avatar de entrega devidamente alterado pelo administrador.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         id:
 *          type: string
 *         deliveryman_id:
 *          type: string
 *         product:
 *          type: string
 *         canceled_at:
 *          type: string
 *         signature_id:
 *          type: string
 *         start_date:
 *          type: string
 *         end_date:
 *          type: string
 *         created_at:
 *          type: string
 *         updated_at:
 *          type: string
 */
deliveriesRouter.patch(
	"/avatar",
	upload.single("avatar"),
	async (request: Request, response: Response) => {
		if (request.file === undefined) {
			throw new AppError("File not found.", 404);
		}

		const { deliveryId } = request.body;
		const avatarFilename = request.file.filename;
		const updateDeliveryAvatarService = new UpdateDeliveryAvatarService();
		const delivery = await updateDeliveryAvatarService.execute({
			deliveryId,
			avatarFilename,
		});

		return response.json(classToClass(delivery));
	},
);

export default deliveriesRouter;
