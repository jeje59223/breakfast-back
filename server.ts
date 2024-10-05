import express from "express";
import dotenv from 'dotenv';
import morgan from 'morgan';
import { MongoClient } from "mongodb";
import usersRouter from './src/routes/users/users.route'

dotenv.config();
const uri = process.env.MONGO_URL as string;
export const client = new MongoClient(uri);

const app = express();
app.use(morgan('dev'))
const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Hello, TypeScript avec Express!");
});

// app.get("/users", (req, res) => {
//     res.send("Users");
//     getUsers()
// });
//
// app.get("/user", (req, res) => {
//     res.send("User by ID");
//     getUserById('6700f5bb73006f3927a9b8bf')
// });

app.listen(PORT, async () => {
    await client.connect();

    console.log("Connexion réussie à la base de données");
    console.log(`Breakfast-back tourne sur le port ${PORT}`);
});

app.use("/users", usersRouter);
