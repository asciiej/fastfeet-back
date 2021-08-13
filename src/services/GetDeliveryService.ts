import AppError from "../errors/AppError";
import Deliveries from "../models/Deliveries";
import {getRepository} from "typeorm";

interface IRequest{
	deliverymanId: string;
	productId: string;
}

class GetDeliveryService{
	public async execute({deliverymanId, productId}: IRequest): Promise<Deliveries>{
		const deliveriesRepository = getRepository(Deliveries);
		const delivery = await deliveriesRepository.findOne({
			where: {
				id: productId,
				deliveryman_id: deliverymanId
			}
		});

		if(!delivery){
			// console.log("Delivery:", delivery);
			throw new AppError("Delivery does not exists.", 404);
		}

		const date = new Date();
		const dateValue = date.valueOf();
		const currentDate = new Date(dateValue);
		const updatedDelivery = delivery;
		updatedDelivery.start_date = currentDate;

		await deliveriesRepository.save(updatedDelivery);

		return updatedDelivery;
	}
};

export default GetDeliveryService;
