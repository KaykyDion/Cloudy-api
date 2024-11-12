import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import router from "./routes/router";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
