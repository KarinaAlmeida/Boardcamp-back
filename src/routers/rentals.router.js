import express from "express";
import {getRentals, novoAluguel, apagarAluguel, finalizarAluguel} from "../controllers/rentals.controllers.js";
// import validateGame from "../middlewares/validateGame.js";
// import { cadastraGame } from "../schemas/gameSchema.js";


const rentalRouter = express.Router();

rentalRouter.get('/rentals', getRentals );
rentalRouter.post('/rentals', novoAluguel );
rentalRouter.post('/rentals/:id/return', finalizarAluguel);
rentalRouter.delete('/rentals/:id', apagarAluguel)


export default rentalRouter;