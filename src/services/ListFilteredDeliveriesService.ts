import {getRepository} from 'typeorm';
import AppError from "../errors/AppError";
import Delivery from "../models/Deliveries";

interface IRequest{
	deliverymanId: string;
	neighborhood: string
}

class ListFilteredDeliveriesService{
	public async execute({deliverymanId, neighborhood}: IRequest): Promise<Delivery[]>{
		const deliveriesRepository = getRepository(Delivery);
		const deliveries = await deliveriesRepository.find({
			where: {
				deliveryman_id: deliverymanId,
			}
		});

		if(!deliveries){
			throw new AppError("Deliveries does not exists.", 400);
		}

		//	Encomendas filtradas por "neighborhood"
		const delivery = deliveries.filter((obj) => {
			obj.neighborhood === neighborhood
		});

		return delivery;
	}
};

export default ListFilteredDeliveriesService;
