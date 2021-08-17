import { getRepository } from "typeorm";
import AppError from "../errors/AppError";
import Deliveries from "../models/Deliveries";

interface IRequest {
	deliverymanId: string;
	productId: string;
}

class CancelDeliveryService {
	public async execute({
		deliverymanId,
		productId,
	}: IRequest): Promise<Deliveries> {
		const deliveriesRepository = getRepository(Deliveries);
		const delivery = await deliveriesRepository.findOne({
			where: {
				id: productId,
				deliveryman_id: deliverymanId,
			},
		});

		if (!delivery) {
			throw new AppError("Delivery does not exists.", 404);
		}

		const date = new Date();
		const dateValue = date.valueOf();
		const currentDate = new Date(dateValue);
		const updatedDelivery = delivery;
		updatedDelivery.canceled_at = currentDate;

		await deliveriesRepository.save(updatedDelivery);

		return updatedDelivery;
	}
}

export default CancelDeliveryService;
