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
   const {name, phone, cpf, birthday} = req.body;
   const idParams = Number(req.params.id)
   if (!idParams || idParams < 1) {
    return res.sendStatus(400);
  }

    try {
        const idCliente= await db.query(`SELECT * FROM customers WHERE id= $1;`, [idParams])

        if (idCliente.rowCount===0) return res.status(404).send("Id não encontrado!")

        const cpfExiste = await db.query(`SELECT * FROM customers WHERE cpf =$1 AND id <> $2;`, [cpf, idParams])

        if (cpfExiste.rowCount>0) return res.status(409).send("Epa! esse cpf não corresponde ao id!")

        await db.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday= $4 WHERE id= $5;`, [name, phone, cpf, birthday, idParams])

        res.status(200).send("Oba! Os dados forama atualizados!")

}catch (error) {
        res.status(500).send(error.message);
    }
  }



export {getCustomers, getCustomersId, newCustomer, reloadCustomer}