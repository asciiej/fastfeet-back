import AppError from "../errors/AppError";
import Deliveries from "../models/Deliveries";
import {getRepository} from "typeorm";

interface IRequest{
	deliverymanId: string;
	productId: string;
}

class CommitDeliveryService{
	public async execute({deliverymanId, productId}: IRequest): Promise<Deliveries>{
		const deliveriesRepository = getRepository(Deliveries);
		const deliveries = await deliveriesRepository.find({
			where: {
				deliveryman_id: deliverymanId
			}
		});

		if(deliveries.length == 0){
			throw new AppError("Deliveryman does not have any products registered.", 400);
		}
		
		const delivery = deliveries.filter((deliveryItem) => {
			return (deliveryItem.id == productId);
		});

		if(delivery.length == 0){
			throw new AppError("Deliveryman product not found.", 404);
		}

		//	Alterar status da encomenda
		const date = new Date();
		const dateValue = date.valueOf();
		const currentDate = new Date(dateValue);
		const updatedDelivery = delivery[0];
		updatedDelivery.end_date = currentDate;

		await deliveriesRepository.save(updatedDelivery);

		return updatedDelivery;
	}
};

export default CommitDeliveryService;