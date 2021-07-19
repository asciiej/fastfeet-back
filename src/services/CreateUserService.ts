import {hash} from "bcryptjs";
import {getRepository} from "typeorm";
import AppError from "../errors/AppError";
import User from "../models/User";

interface IRequest{
	name: string;
	email: string;
	cpf: string;
	password: string;
	isDeliveryman: boolean;
}

class CreateUserService{
	public async execute({name, email, cpf, password, isDeliveryman}: IRequest): Promise<User>{
		const usersRepository = getRepository(User);
		const checkEmailExists = await usersRepository.findOne({
			where: {
				email: email
			}
		});

		if(checkEmailExists){
			throw new AppError("Email address already in use.", 406);
		}

		const checkCPFExists = await usersRepository.findOne({
			where: {
				cpf: cpf
			}
		});

		if(checkCPFExists){
			throw new AppError("CPF already in use.", 406);
		}

		const hashedPassword = await hash(password, 8);
		const user = usersRepository.create({
			name: name,
			email: email,
			cpf: cpf,
			password: hashedPassword,
			isDeliveryman: isDeliveryman
		});

		await usersRepository.save(user);

		return user;
	}
};

export default CreateUserService;
