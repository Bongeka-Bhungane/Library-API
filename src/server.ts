import express, { Express } from "express";
import bodyParser from "body-parser";
import { loggerMiddleware } from "./middleware/logger";
import authorRouter from "./routes/authors"
import bookRouter from "./routes/books"

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(bodyParser.json())

app.use(loggerMiddleware)
app.use("/authors", authorRouter)
app.use("/books", bookRouter)

app.get("/", (req, res) => {
    res.json({ message: "Library API is running"})
})

app.listen(PORT, () => {
    console.log(`srver is running on http://localhost:${PORT}`);
});