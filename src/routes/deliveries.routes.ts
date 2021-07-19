import {classToClass} from 'class-transformer';
import {Request, Response, Router} from "express";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import CreateDeliveryService from "../services/CreateDeliveryService";
import DeleteDeliveryService from '../services/DeleteDeliveryService';
import ensureIsAdmin from '../middlewares/ensureIsAdmin';

const deliveriesRouter = Router();

deliveriesRouter.use(ensureAuthenticated);
deliveriesRouter.use(ensureIsAdmin);

deliveriesRouter.post("/", async (request: Request, response: Response) => {
	const {deliveryman_id, product, address, postal_code, neighborhood, city, state, signature_id} = request.body;
	const createDelivery = new CreateDeliveryService();
	const delivery = await createDelivery.execute({
		deliveryman_id: deliveryman_id,
		product: product,
		address: address,
		postal_code: postal_code,
		neighborhood: neighborhood,
		city: city,
		state: state,
		signature_id: signature_id
	});
	
	return response.json(
		classToClass(delivery)
	);
});

deliveriesRouter.delete("/", async (request: Request, response: Response) => {
	const {id} = request.body;
	const deleteDeliveryService = new DeleteDeliveryService();
	await deleteDeliveryService.execute({id});
	
	return response.json({
		message: "Delivery deleted."
	});
});

export default deliveriesRouter;
