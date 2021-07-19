import {Request, Response, NextFunction} from 'express';
import {getRepository} from 'typeorm';
import AppError from "../errors/AppError";
import User from "../models/User";

export default async function ensureIsDeliveryman(request: Request, response: Response, next: NextFunction): Promise<void>{
	const userId = request.user.id;
	const usersRepository = getRepository(User);
	const user = await usersRepository.findOne({
		where: {id: userId}
	});
	
	if(!user){
		throw new AppError("User does not exists.", 404);
	}

	if(!user.isDeliveryman){
		throw new AppError("Unauthorized access.", 401);
	}

	return next();
};