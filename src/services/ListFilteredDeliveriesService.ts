import { getRepository } from "typeorm";
import AppError from "../errors/AppError";
import Deliveries from "../models/Deliveries";

interface IRequest {
	deliverymanId: string;
	neighborhood: string;
}

class ListFilteredDeliveriesService {
	public async execute({
		deliverymanId,
		neighborhood,
	}: IRequest): Promise<Deliveries[]> {
		const deliveriesRepository = getRepository(Deliveries);
		const deliveries = await deliveriesRepository.find({
			where: {
				deliveryman_id: deliverymanId,
			},
		});

		if (deliveries.length === 0) {
			throw new AppError("Deliveries does not exists.", 400);
		}

		//	Encomendas filtradas por "neighborhood"
		const delivery = deliveries.filter(deliveryItem => {
			return deliveryItem.neighborhood.includes(neighborhood);
		});

		return delivery;
	}
}

export default ListFilteredDeliveriesService;
