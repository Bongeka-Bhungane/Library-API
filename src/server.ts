import express, { Express } from "express";
import bodyParser from "body-parser";
import { loggerMiddleware } from "./middleware/logger";
import router from "./routes/authors"

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(bodyParser.json())

app.use(loggerMiddleware)
app.use("/authors", router)

app.listen(PORT, () => {
    console.log(`srver is running on http://localhost:${PORT}`);
});