import {Router, Request, Response} from "express";
import ListDeliveriedsService from "../services/ListDeliveriedsService";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import ensureIsDeliveryman from "../middlewares/ensureIsDeliveryman";
import ListDeliveryService from "../services/ListDeliveryService";
import ListFilteredDeliveriesService from "../services/ListFilteredDeliveriesService";
import CommitDeliveryService from "../services/CommitDeliveryService";
import GetDeliveryService from "../services/GetDeliveryService";
import CancelDeliveryService from "../services/CancelDeliveryService";
import {classToClass} from "class-transformer";

const deliverymanRouter = Router();

deliverymanRouter.use(ensureAuthenticated);
deliverymanRouter.use(ensureIsDeliveryman);

// Adiel: 74a00882-18c2-47d0-8521-65636787166f

deliverymanRouter.get("/list", async (request: Request, response: Response) => {
	const deliverymanId = request.user.id;
	const listDeliveriesService = new ListDeliveryService();
	const deliveries = await listDeliveriesService.execute({deliverymanId});
	
	return response.json({
		deliveries
	});
});

deliverymanRouter.get("/delivered", async (request: Request, response: Response) => {
	const deliverymanId = request.user.id;
	const listDeliveriedsService = new ListDeliveriedsService();
	const deliveredList = await listDeliveriedsService.execute({deliverymanId});

	return response.json({
		deliveredList
	});
});

deliverymanRouter.get("/list/:neighborhood", async (request: Request, response: Response) => {
	const deliverymanId = request.user.id;
	const {neighborhood} = request.params;
	const listFilteredDeliveriesService = new ListFilteredDeliveriesService();
	const filteredDeliveries = await listFilteredDeliveriesService.execute({deliverymanId, neighborhood});

	return response.json({
		filteredDeliveries
	});
});

//	Pegar a entrega
deliverymanRouter.patch("/getDelivery/:productId", async (request: Request, response: Response) => {
	const {productId} = request.params;
	const deliverymanId = request.user.id;
	const getDeliveryService = new GetDeliveryService();
	const delivery = await getDeliveryService.execute({deliverymanId, productId});

	return response.json(
		classToClass(delivery)
	);
});

//	Cancelar a entrega
deliverymanRouter.patch("/cancelDelivery/:productId", async (request: Request, response: Response) => {
	const {productId} = request.params;
	const deliverymanId = request.user.id;
	const cancelDeliveryService = new CancelDeliveryService();
	const delivery = await cancelDeliveryService.execute({deliverymanId, productId});

	return response.json(
		classToClass(delivery)
	);
});

//	Terminar a entrega
deliverymanRouter.patch("/commitDelivery/:productId", async (request: Request, response: Response) => {
	const {productId} = request.params;
	const deliverymanId = request.user.id;
	const deliverService = new CommitDeliveryService();
	const delivery = await deliverService.execute({deliverymanId, productId});

	return response.json(
		classToClass(delivery)
	);
});

export default deliverymanRouter;
