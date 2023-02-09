import {db} from "../database/database.connection.js";


 async function getCustomers(req, res) {
try {
    const clientes = await db.query("SELECT * FROM customers");

    res.send(clientes.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}


 async function getCustomersId (req, res) {
    const {id} = req.params;
    try {
        const idCliente = await db.query(`SELECT * FROM customers WHERE id = $1`, [id]);
    
        if (idCliente.rowCount === 0) return res.status(404).send("Opa! Não encontramos esse Id!");
    
        res.send(idCliente.rows[0])
      } catch (error) {
        res.status(500).send(error.message);
      }
}

async function newCustomer (req, res) {
    const {name, phone, cpf, birthday} = req.body;

    try {
        const jaExiste= await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf])
        if (jaExiste.rowCount >0) return res.status(409).send("Cliente já cadastrado no sistema!")

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]);
   
   
    return res.status(201).send("Cliente cadastrado!")

    }catch (error) {
        res.status(500).send(error.message);
    }
}

  


async function reloadCustomer (req, res) {
   
}

export {getCustomers, getCustomersId, newCustomer, reloadCustomer}