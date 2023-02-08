import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import joi from "joi";
import {db} from "./database/database.connection.js";

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));


//ROTA LISTAR DE GAMES
server.get("/games", async (req,res) => {
    try{
    const jogos= await db.query("SELECT * FROM games");
    res.send(jogos.rows);
    } catch (err) {
        console.log(err);
       
    }
})
