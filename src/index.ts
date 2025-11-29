import express, { Request, Response } from "express";

import cors from "cors";
import userRoutes from "../src/routes/authRouter";
import profileRoutes from "../src/routes/profileRouter";
import homeRoutes from "../src/routes/homeRouter";
import errorHandler from "./middleware/errorHandler";
import fs from "fs";
import { PORT } from "./helpers/config";

const app = express();
export const folderName = "uploads";

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
  app.use(express.json());
  app.use(cors());
  app.use(`/${folderName}`, express.static(folderName));
  app.use("/auth", userRoutes);
  app.use("/profile", profileRoutes);
  app.use("/home", homeRoutes);
  app.use(errorHandler);

  app.get("/", (_: Request, res: Response) => {
    res.send("Hello World!");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
  });
} catch (err) {
  console.error("Server failed to start: ", err);
}
