import {getRepository} from "typeorm";
import AppError from "../errors/AppError";
import Deliveries from "../models/Deliveries";
import User from "../models/User";

interface IRequest{
	deliveryman_id: string;
	product: string;
	address: string;
	postal_code: string;
	neighborhood: string;
	city: string;
	state: string;
	signature_id?: string;
}

class CreateDeliveryService{
	public async execute({deliveryman_id, product, address, postal_code, neighborhood, city, state, signature_id}: IRequest): Promise<Deliveries>{
		const usersRepository =  getRepository(User);
		const authenticateUser = await usersRepository.findOne({
			where: {
				id: deliveryman_id
			}
		});

		if(!authenticateUser){
			throw new AppError("Deliveryman is invalid.", 401);
		}

		if(!authenticateUser.isDeliveryman){
			throw new AppError("This user is not a deliveryman.", 401);
		}
		
		const deliveriesRepository = getRepository(Deliveries);
		const delivery = deliveriesRepository.create({
			deliveryman_id: deliveryman_id,
			product: product,
			address: address,
			postal_code: postal_code,
			neighborhood: neighborhood,
			city: city,
			state: state,
			signature_id: signature_id
		});

		await deliveriesRepository.save(delivery);

		return delivery;
	}
};

export default CreateDeliveryService;
