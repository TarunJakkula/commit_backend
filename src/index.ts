import express, { Request, Response } from "express";
import dotenv from "dotenv";
import process from "node:process";
import userRoutes from "../src/routes/authRouter.ts";
import profileRoutes from "../src/routes/profileRouter.ts";
import errorHandler from "./middleware/errorHandler.ts";

const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(express.json());
app.use("/auth", userRoutes);
app.use("/profile", profileRoutes);
app.use(errorHandler);

app.get("/", (_: Request, res: Response) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
