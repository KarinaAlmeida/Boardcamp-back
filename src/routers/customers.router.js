import express from "express";
import { getCustomers, getCustomersId, newCustomer, reloadCustomer } from "../controllers/customers.controllers.js";
import validateCustomer from "../middlewares/validateCustomer.js";
import { cadastraCliente } from "../schemas/customerSchema.js";



const customerRouter = express.Router();

customerRouter.get('/customers', getCustomers);
customerRouter.get('/customers/:id', getCustomersId);
customerRouter.post('/customers', validateCustomer(cadastraCliente) ,newCustomer);
customerRouter.put('/customers/:id', validateCustomer(cadastraCliente), reloadCustomer);

export default customerRouter;