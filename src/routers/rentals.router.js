import express from "express";
import {getRentals, novoAluguel, apagarAluguel, finalizarAluguel} from "../controllers/rentals.controllers.js";
import validateRent from "../middlewares/validateRent.js";
import { cadastraRent } from "../schemas/rentSchema.js";


const rentalRouter = express.Router();

rentalRouter.get('/rentals', getRentals );
rentalRouter.post('/rentals', validateRent(cadastraRent), novoAluguel );
rentalRouter.post('/rentals/:id/return', finalizarAluguel);
rentalRouter.delete('/rentals/:id', apagarAluguel)


export default rentalRouter;