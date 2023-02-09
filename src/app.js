import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import joi from "joi";
// import {db} from "./database/database.connection.js";
import gameRouter from "./routers/games.router.js";
import customerRouter from "./routers/customers.router.js";

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));


server.use(gameRouter)
server.use(customerRouter)

