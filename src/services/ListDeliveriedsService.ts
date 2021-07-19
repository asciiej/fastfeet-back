import {getRepository} from 'typeorm';
import AppError from "../errors/AppError";
import Delivery from "../models/Deliveries";

interface IRequest{
	deliverymanId: string;
}

class ListDeliveriedsService{
	public async execute({deliverymanId}: IRequest): Promise<Delivery[]>{
		const deliveriesRepository = getRepository(Delivery);
		const deliveries = await deliveriesRepository.find({
			where: {
				deliveryman_id: deliverymanId,
			}
		});

		if(!deliveries){
			throw new AppError("Deliveries does not exists.", 400);
		}

		//	Encomendas JÁ entregues
		const delivery = deliveries.filter((obj) => {
			obj.end_date !== null
		});

		return delivery;
	}
};

export default ListDeliveriedsService;
