import { AppDataSource } from "./data-source";
import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { errorHandler } from "./middleware/error.middleware";
import userRouter from "./routers/user.routes";
import blogRouter from "./routers/blog.routes";
import authRouter from "./routers/auth.routes";
import "reflect-metadata";
import { error } from "console";
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(errorHandler);
const { PORT = 3001 } = process.env;
app.use("/api/users", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/auth", authRouter);

app.get("*", (req: Request, res: Response) => {
    res.status(404).send("Not Found");
});

AppDataSource.initialize()
    .then(async () => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        console.log("Database connected");
    })
    .catch(error => console.log(error))
