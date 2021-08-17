import { Router, Request, Response } from "express";
import { classToClass } from "class-transformer";
import ListDeliveriedsService from "../services/ListDeliveriedsService";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import ensureIsDeliveryman from "../middlewares/ensureIsDeliveryman";
import ListDeliveryService from "../services/ListDeliveryService";
import ListFilteredDeliveriesService from "../services/ListFilteredDeliveriesService";
import CommitDeliveryService from "../services/CommitDeliveryService";
import GetDeliveryService from "../services/GetDeliveryService";
import CancelDeliveryService from "../services/CancelDeliveryService";

const deliverymanRouter = Router();

deliverymanRouter.use(ensureAuthenticated);
deliverymanRouter.use(ensureIsDeliveryman);
// Adiel: 74a00882-18c2-47d0-8521-65636787166f

/**
 * @openapi
 * /deliveryman/list:
 *  get:
 *   summary: Listagem de entregas
 *   description: Essa rota será responsável por listar as entregas disponíveis de um entregador.
 *   tags: [
 *    Entregador,
 *    Entregas,
 *    Listagem
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
 *        deliverymanID:
 *         type: string
 *   responses:
 *    400:
 *     description: Deliveries does not exists.
 *    200:
 *     description: Lista de entregas disponíveis de um entregador.
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
deliverymanRouter.get("/list", async (request: Request, response: Response) => {
	const deliverymanId = request.user.id;
	const listDeliveriesService = new ListDeliveryService();
	const deliveries = await listDeliveriesService.execute({ deliverymanId });

	return response.json({
		deliveries,
	});
});

/**
 * @openapi
 * /deliveryman/delivered:
 *  get:
 *   summary: Listagem de entregas entregues
 *   description: Essa rota será responsável por listar as entregas já entregues de um entregador.
 *   tags: [
 *    Entregador,
 *    Entregas,
 *    Listagem
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
 *        deliverymanID:
 *         type: string
 *   responses:
 *    400:
 *     description: Deliveries does not exists.
 *    200:
 *     description: Lista de entregas disponíveis de um entregador.
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
deliverymanRouter.get(
	"/delivered",
	async (request: Request, response: Response) => {
		const deliverymanId = request.user.id;
		const listDeliveriedsService = new ListDeliveriedsService();
		const deliveredList = await listDeliveriedsService.execute({
			deliverymanId,
		});

		return response.json({
			deliveredList,
		});
	},
);

/**
 * @openapi
 * /deliveryman/list/{neighborhood}:
 *  get:
 *   summary: Listagem de entregas por bairro
 *   description: Essa rota será responsável por listar as entregas já entregues de um entregador.
 *   tags: [
 *    Entregador,
 *    Entregas,
 *    Listagem
 *   ]
 *   security: [
 *    bearerAuth: []
 *   ]
 *   parameters:
 *    - in: path
 *      name: neighborhood
 *      description: Bairro de entregas.
 *      required: true
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        deliverymanID:
 *         type: string
 *   responses:
 *    400:
 *     description: Deliveries does not exists.
 *    200:
 *     description: Lista de entregas disponíveis de um entregador.
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
deliverymanRouter.get(
	"/list/:neighborhood",
	async (request: Request, response: Response) => {
		const deliverymanId = request.user.id;
		const { neighborhood } = request.params;
		const listFilteredDeliveriesService = new ListFilteredDeliveriesService();
		const filteredDeliveries = await listFilteredDeliveriesService.execute({
			deliverymanId,
			neighborhood,
		});

		return response.json({
			filteredDeliveries,
		});
	},
);

/**
 * @openapi
 * /deliveryman/getDelivery/{productId}:
 *  patch:
 *   summary: Inicio de entrega
 *   description: Essa rota será responsável por atualizar o estado de uma entrega como "pega" por um entregador.
 *   tags: [
 *    Entregador,
 *    Entregas
 *   ]
 *   security: [
 *    bearerAuth: []
 *   ]
 *   parameters:
 *    - in: path
 *      name: productId
 *      description: ID da entrega a ser "pega".
 *      required: true
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        deliverymanID:
 *         type: string
 *   responses:
 *    404:
 *     description: Deliveries does not exists.
 *    200:
 *     description: Entregas pega por um entregador.
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
deliverymanRouter.patch(
	"/getDelivery/:productId",
	async (request: Request, response: Response) => {
		const { productId } = request.params;
		const deliverymanId = request.user.id;
		const getDeliveryService = new GetDeliveryService();
		const delivery = await getDeliveryService.execute({
			deliverymanId,
			productId,
		});

		return response.json(classToClass(delivery));
	},
);

/**
 * @openapi
 * /deliveryman/cancelDelivery/{productId}:
 *  patch:
 *   summary: Cancelamento de entrega
 *   description: Essa rota será responsável por cancelar o estado de uma entrega por um entregador.
 *   tags: [
 *    Entregador,
 *    Entregas
 *   ]
 *   security: [
 *    bearerAuth: []
 *   ]
 *   parameters:
 *    - in: path
 *      name: productId
 *      description: ID da entrega a ser cancelada.
 *      required: true
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        deliverymanID:
 *         type: string
 *   responses:
 *    404:
 *     description: Deliveries does not exists.
 *    200:
 *     description: Entregas cancelada por um entregador.
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
deliverymanRouter.patch(
	"/cancelDelivery/:productId",
	async (request: Request, response: Response) => {
		const { productId } = request.params;
		const deliverymanId = request.user.id;
		const cancelDeliveryService = new CancelDeliveryService();
		const delivery = await cancelDeliveryService.execute({
			deliverymanId,
			productId,
		});

		return response.json(classToClass(delivery));
	},
);

/**
 * @openapi
 * /deliveryman/commitDelivery/{productId}:
 *  patch:
 *   summary: Recebimento de entrega
 *   description: Essa rota será responsável por receber uma entrega por um usuário.
 *   tags: [
 *    Entregador,
 *    Entregas
 *   ]
 *   security: [
 *    bearerAuth: []
 *   ]
 *   parameters:
 *    - in: path
 *      name: productId
 *      description: ID da entrega a ser recebida.
 *      required: true
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        deliverymanID:
 *         type: string
 *   responses:
 *    404:
 *     description: Deliveries does not exists.
 *    200:
 *     description: Entrega recebida por um usuário.
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
deliverymanRouter.patch(
	"/commitDelivery/:productId",
	async (request: Request, response: Response) => {
		const { productId } = request.params;
		const deliverymanId = request.user.id;
		const deliverService = new CommitDeliveryService();
		const delivery = await deliverService.execute({ deliverymanId, productId });

		return response.json(classToClass(delivery));
	},
);

export default deliverymanRouter;
