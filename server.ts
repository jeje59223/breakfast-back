import express from "express";
import dotenv from 'dotenv';
import morgan from 'morgan';
import { MongoClient } from "mongodb";
import usersRouter from './src/routes/users/users.route'

dotenv.config();

const uri = process.env.MONGO_URL as string;
export const client = new MongoClient(uri);
const app = express();
const PORT = process.env.PORT;

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello, TypeScript avec Express!");
});

if (process.env.NODE_ENV !== 'test') {
    client.connect().then(() => {
        app.listen(PORT, () => {
            console.log("Connexion réussie à la base de données");
            console.log(`Breakfast-back tourne sur le port ${PORT}`);
        });
    });
}

app.use("/users", usersRouter);
