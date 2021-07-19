import {getRepository} from "typeorm";
import {compare} from "bcryptjs";
import {sign} from "jsonwebtoken";
import authConfig from "../config/auth";
import AppError from "../errors/AppError";
import User from "../models/User";

interface IRequest{
	cpf: string;
	password: string;
};

interface IResponse{
	user: User;
	token: string;
};

class AuthenticateUserService{
	public async execute({cpf, password}: IRequest): Promise<IResponse>{
		const usersRepository = getRepository(User);
		const user = await usersRepository.findOne({
			where: {
				cpf: cpf
			}
		});

		if(!user){
			throw new AppError("Incorrect CPF/password combination.", 401);
		}

		// user.password - Senha criptografada
		// password - Senha não-criptografada (a que o usuario tentou inserir)

		const passwordMatched = await compare(password, user.password);

		if(!passwordMatched){
			throw new AppError("Incorrect CPF/password combination.", 401);
		}

		const {secret, expiresIn} = authConfig.jwt;
		const token = sign({}, secret, {
			subject: user.id,
			expiresIn,
		});

		return {
			user,
			token,
		};
	};
};

export default AuthenticateUserService;
