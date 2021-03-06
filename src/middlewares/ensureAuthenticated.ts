import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import authConfig from "../config/auth";
import AppError from "../errors/AppError";

interface ITokenPayload {
	iat: number;
	exp: number;
	sub: string;
}

export default function ensureAuthenticated(
	request: Request,
	response: Response,
	next: NextFunction,
): void {
	// Validação do token JWT
	const authHeader = request.headers.authorization;

	if (!authHeader) {
		throw new AppError("JWT token is missing.", 401);
	}

	// type não será utilizado
	const [, token] = authHeader.split(" ");

	const decoded = verify(token, authConfig.jwt.secret);
	const { sub } = decoded as ITokenPayload;

	request.user = {
		id: sub,
	};

	return next();
}
