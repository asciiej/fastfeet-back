import {Router, Request, Response} from "express";
import ListDeliveriedsService from "../services/ListDeliveriedsService";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import ensureIsDeliveryman from "../middlewares/ensureIsDeliveryman";
import ListDeliveryService from "../services/ListDeliveryService";
import ListFilteredDeliveriesService from "../services/ListFilteredDeliveriesService";

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
	const deliverieds = await listDeliveriedsService.execute({deliverymanId});

	return response.json({
		deliverieds
	});
});

deliverymanRouter.get("/deliveries", async (request: Request, response: Response) => {
	const deliverymanId = request.user.id;
	const neighborhood = request.body;
	const listFilteredDeliveriesService = new ListFilteredDeliveriesService();
	const filteredDeliveries = listFilteredDeliveriesService.execute({deliverymanId, neighborhood});

	return response.json({
		filteredDeliveries
	});
});

export default deliverymanRouter;
