import "reflect-metadata";
import "express-async-errors"
import express, {Request, Response, NextFunction} from "express";
import routes from "./routes";
import "./database";
import AppError from "./errors/AppError";

const app = express();
const port = 3333;

app.use(express.json());
app.use(routes);
app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
	if(error instanceof AppError){
		return response.status(error.statusCode).json({
			error: error.message
		});
	}

	const message = "Internal server error: " + error.message;
	return response.status(500).json({
		error: message
	});
});

app.listen(port, () => {
  console.log("🚀 Server started on port:", port);
});
