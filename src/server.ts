import "reflect-metadata";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import "./database";
import AppError from "./errors/AppError";
import routes from "./routes";
import uploadConfig from "./config/upload";

const app = express();
const port = 3333;

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Fastfeet API",
			version: "1.0.0",
			description:
				"Esta API tem como objetivo a manipulação de entregas e entregadores.",
			contact: {
				name: "ASCII Empresa Junior",
				email: "asciiej@gmail.com",
				url: "https://asciiej.com.br/",
			},
		},
		servers: [
			{
				url: "http://localhost:3333",
				description: "API de testes.",
			},
		],
	},
	apis: ["./src/routes/*.ts"],
};

const openapiSpecification = swaggerJSDoc(swaggerOptions);

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use("/files", express.static(uploadConfig.directory));
app.use(routes);
app.use(
	(error: Error, request: Request, response: Response, next: NextFunction) => {
		if (error instanceof AppError) {
			return response.status(error.statusCode).json({
				error: error.message,
			});
		}

		const message = `Internal server error: ${error.message}`;
		return response.status(500).json({
			error: message,
		});
	},
);

app.listen(port, () => {
	console.log("🚀 Server started on port:", port);
});
