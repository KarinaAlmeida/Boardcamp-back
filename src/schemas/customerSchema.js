import joi from "joi";

export const cadastraCliente = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().length(11).pattern(/^[0-9]+$/, 'numbers').required(),
    birthday: joi.date().iso().required(),
  });

 
