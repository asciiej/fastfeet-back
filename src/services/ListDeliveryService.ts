import { getRepository } from "typeorm";
import AppError from "../errors/AppError";
import Deliveries from "../models/Deliveries";

interface IRequest {
	deliverymanId: string;
}

class ListDeliveryService {
	public async execute({ deliverymanId }: IRequest): Promise<Deliveries[]> {
		const deliveriesRepository = getRepository(Deliveries);
		const deliveries = await deliveriesRepository.find({
			where: {
				deliveryman_id: deliverymanId,
			},
		});

		if (deliveries.length === 0) {
			throw new AppError("Deliveries does not exists.", 400);
		}

		//	Encomendas NÃO entregues NEM canceladas
		const delivery = deliveries.filter(obj => {
			return obj.canceled_at === null && obj.end_date === null;
		});

		return delivery;
	}
}

export default ListDeliveryService;
