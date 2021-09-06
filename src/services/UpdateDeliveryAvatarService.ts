import { getRepository } from "typeorm";
import path from "path";
import fs from "fs";
import AppError from "../errors/AppError";
import uploadConfig from "../config/upload";
import Deliveries from "../models/Deliveries";

interface IRequest {
	deliveryId: string;
	avatarFilename: string;
}

class UpdateDeliveryAvatarService {
	public async execute({
		deliveryId,
		avatarFilename,
	}: IRequest): Promise<Deliveries> {
		const deliveriesRepository = getRepository(Deliveries);
		const delivery = await deliveriesRepository.findOne({
			where: {
				id: deliveryId,
			},
		});

		if (!delivery) {
			throw new AppError("Delivery not found", 404);
		}

		if (delivery.avatar) {
			//	Deletar avatar anterior
			const deliveryAvatarFilePath = path.join(
				uploadConfig.directory,
				delivery.avatar,
			);

			const deliveryAvatarFileExists = fs.existsSync(deliveryAvatarFilePath);

			if (deliveryAvatarFileExists) {
				fs.unlinkSync(deliveryAvatarFilePath);
			}
		}

		delivery.avatar = avatarFilename;
		await deliveriesRepository.save(delivery);

		return delivery;
	}
}

export default UpdateDeliveryAvatarService;
