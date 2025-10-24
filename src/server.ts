import express, { Express } from "express";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()) => {
    console.log(`srver is running on http://localhost:${PORT}`);
};