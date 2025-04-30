import express, { Request, Response } from "express";
import dotenv from "dotenv";
import process from "node:process";
import userRoutes from "../src/routes/authRouter";
import profileRoutes from "../src/routes/profileRouter";
import homeRoutes from "../src/routes/homeRouter";
import errorHandler from "./middleware/errorHandler";

const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(express.json());
app.use("/auth", userRoutes);
app.use("/profile", profileRoutes);
app.use("/home", homeRoutes);
app.use(errorHandler);

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
