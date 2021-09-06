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
 *         example: 74a00882-18c2-47d0-8521-65636787166f
 *        product:
 *         type: string
 *         example: Produto
 *        address:
 *         type: string
 *         example: Endereço
 *        postal_code:
 *         type: string
 *         example: Codigo Postal
 *        neighborhood:
 *         type: string
 *         example: Bairro
 *        city:
 *         type: string
 *         example: Cidade
 *        state:
 *         type: string
 *         example: Estado
 *        signature_id:
 *         type: string
 *         example: ""
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
 *         example: b3a75166-426b-407f-828d-0653814ad69c
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
 * /deliveries/avatar/{deliveryId}:
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
 *   parameters:
 *    - in: form
 *      name: Avatar
 *      description: Avatar novo
 *      schema:
 *       type: file
 *    - in: path
 *      name: deliveryId
 *      type: string
 *      description: Id da encomenda
 *      required: true
 *      example: fe28885c-dc2a-4b64-8c7e-e064c827c9aa
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
//	Avatar não está completo na documentação
deliveriesRouter.patch(
	"/avatar/:deliveryId",
	upload.single("avatar"),
	async (request: Request, response: Response) => {
		if (request.file === undefined) {
			throw new AppError("File not found.", 404);
		}

		const { deliveryId } = request.params;
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
