import {getRepository} from "typeorm";
import AppError from "../errors/AppError";
import User from "../models/User";

interface IRequest{
	adminID: string;
	cpf: string;
}

class DeleteUserService{
	public async execute({adminID, cpf}: IRequest): Promise<void>{
		const usersRepository = getRepository(User);
		const user = await usersRepository.findOne({
			where: {
				cpf: cpf
			}
		});

		if(!user){
			throw new AppError("User does not exists.", 404);
		}
		
		if(user.id === adminID){
			throw new AppError("User cannot delete itself.", 401);
		}

		await usersRepository.delete({
			cpf: user.cpf
		});

		return;
	};
};

export default DeleteUserService;