import {getRepository} from 'typeorm';
import AppError from "../errors/AppError";
import Delivery from "../models/Deliveries";

interface IRequest{
	deliverymanId: string;
}

class ListDeliveryService{
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

		//	Encomendas NÃO entregues NEM canceladas
		const delivery = deliveries.filter((obj) => {
			obj.canceled_at === null,
			obj.end_date === null
		});

		return delivery;
	}
};

export default ListDeliveryService;
