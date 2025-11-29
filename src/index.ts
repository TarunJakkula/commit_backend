import express, { Request, Response } from "express";

import cors from "cors";
import userRoutes from "../src/routes/authRouter";
import profileRoutes from "../src/routes/profileRouter";
import homeRoutes from "../src/routes/homeRouter";
import errorHandler from "./middleware/errorHandler";
import fs from "fs";
import { UPLOAD_FOLDER, PORT } from "./helpers/config";

const app = express();

try {
  if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER);
  }
  app.use(express.json());
  app.use(cors());
  app.use(`/${UPLOAD_FOLDER}`, express.static(UPLOAD_FOLDER));
  app.use("/auth", userRoutes);
  app.use("/profile", profileRoutes);
  app.use("/home", homeRoutes);
  app.use(errorHandler);

  app.get("/", (_: Request, res: Response) => {
    res.send("Hello World!");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port🥳 : ${PORT}`);
  });
} catch (err) {
  console.error("Server failed to start: ", err);
}
