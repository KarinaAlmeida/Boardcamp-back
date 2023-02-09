import express from "express";
import {getGames, postGames} from "../controllers/games.controllers.js";
import validateGame from "../middlewares/validateGame.js";
import { cadastraGame } from "../schemas/gameSchema.js";
import existeGame from "../middlewares/existeValidate.js";

const gameRouter = express.Router();

gameRouter.get('/games', getGames);
gameRouter.post('/games', existeGame(), validateGame(cadastraGame), postGames);

export default gameRouter;