import express from "express";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Hello, TypeScript avec Express!");
});

app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}`);
});
