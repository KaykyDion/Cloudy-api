import express from "express";
import cors from "cors";
import "dotenv/config";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import router from "./routes/router";
import { env } from "./env";

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorHandlerMiddleware);

const PORT = env.PORT;
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
