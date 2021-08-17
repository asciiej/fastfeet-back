import { getRepository } from "typeorm";
import Deliveries from "../models/Deliveries";
import AppError from "../errors/AppError";

interface IRequest {
	id: string;
}

class DeleteDeliveryService {
	public async execute({ id }: IRequest): Promise<void> {
		const deliveriesRepository = getRepository(Deliveries);
		const checkDelivery = await deliveriesRepository.findOne({
			where: {
				id,
			},
		});

		if (!checkDelivery) {
			throw new AppError("Delivery does not exists.", 404);
		}

		await deliveriesRepository.delete({
			id: checkDelivery.id,
		});
	}
}

export default DeleteDeliveryService;
