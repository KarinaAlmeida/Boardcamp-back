import {db} from "../database/database.connection.js";
import dayjs from "dayjs";


async function getRentals (req, res) {
    try {
        const rentals = await db.query (`
        SELECT rentals.*, customers.id AS customers_id, customers.name AS customers_name, games.id AS games_id, games.name AS games_name 
        FROM rentals
        JOIN customers
        ON rentals."customerId" = customers.id
        JOIN games
        ON rentals."gameId"= games.id    
        ;`)

        const novoRentals= rentals.rows.map(rent =>{
            return {
                id:rent.id,
                customerId:rent.customerId,
                gameId: rent.gameId,
                rentDate: rent.rentDate,
                daysRented: rent.daysRented,
                returnDate: rent.returnDate,
                originalPrice: rent.originalPrice,
                delayFee: rent.delayFee,
                customer: {
                    id: rent.customers_id,
                    name: rent.customers_name
                },
                game: {
                    id: rent.games_id,
                    name: rent.games_name
                }

            } 
            })
        res.send(novoRentals)

    }catch (error) {
        res.status(500).send(error.message);
    }

}

async function novoAluguel (req,res){
const { customerId, gameId, daysRented } = req.body;
let time = dayjs().format("YYYY-MM-DD")

try {
    if(daysRented <=0) return res.sendStatus(400)

    const naoExiste = await db.query('SELECT * FROM games WHERE id = $1', [
        gameId,
      ]);
      if (naoExiste.rowCount !== 1) {
        return res.status(400).send("Opa! Esse jogo não existe! ");
      }

      const clienteExiste = await db.query(
        'SELECT * FROM customers WHERE id = $1',
        [customerId]
      );
      if (clienteExiste.rowCount !== 1) {
        return res.status(400).send("Ei! Esse cliente não existe!");
      }

      const alugueis = await db.query(`
      SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL;
      `, [gameId])

      const stock = await db.query(`
      SELECT "stockTotal" FROM games WHERE id = $1
      
      `, [gameId]) 

      
      if (stock.rows[0].stockTotal <= alugueis.rowCount) {
        return res.status(400).send("Poxa, estamos sem estoque!")
      }
 

      const price= await db.query (
        `SELECT "pricePerDay" FROM games WHERE id = $1`, [gameId]
      )

        

      const rental = await db.query(
        `
      INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice")
      VALUES ($1, $2, $3, $4 , $5);
      `,
        [customerId, gameId, daysRented, time, daysRented*price.rows[0].pricePerDay ]
        
      );
  
      if (rental.rowCount === 1) {
        res.status(201).send("Aluguel cadastrado!");
      }


}catch (error) {
        res.status(500).send(error.message);
    }


}

async function finalizarAluguel (req,res) {
    const idParams = Number(req.params.id)
    if (!idParams || idParams < 1) {
     return res.sendStatus(400);
   }

try{

    const returnDate= dayjs().format("YYYY-MM-DD")

    const idAluguel= await db.query(`SELECT * FROM rentals WHERE id= $1;`, [idParams])

    if (idAluguel.rowCount===0) return res.status(404).send("Id de aluguel não encontrado!")

    const alugueis = await db.query(`
      SELECT * FROM rentals WHERE "id" = $1 AND "returnDate" IS NULL;
      `, [idParams])

      if (alugueis.rowCount ===0) return res.status(400).send("Esse aluguel já foi finalizado!");


    const {rows: rentals} = await db.query (`
    SELECT "rentDate", "daysRented", "originalPrice" FROM rentals WHERE id=$1;`, [idParams]
)


    const {rentDate, daysRented, originalPrice} = rentals[0];

    const diasPassados = dayjs(returnDate).diff(rentDate, "days");
    const pricePerDay = originalPrice / daysRented;
    
    const atrasado = (diasPassados <= daysRented) ? 0 : (diasPassados - daysRented) * pricePerDay;

    await db.query(`
    UPDATE
        rentals
    SET "returnDate" = $1, "delayFee" = $2
    WHERE id = $3;
`, [returnDate, atrasado, idParams]);

return res.status(200).send("Aluguel finalizado com sucesso!");


}catch (error) {
    res.status(500).send(error.message);
}

}

async function apagarAluguel (req,res) {
    const idParams = Number(req.params.id)
    if (!idParams || idParams < 1) {
     return res.sendStatus(400);
   }

   try {
   const idAluguel= await db.query(`SELECT * FROM rentals WHERE id= $1;`, [idParams])

   if (idAluguel.rowCount===0) return res.status(404).send("Id de aluguel não encontrado!")

   const alugueis = await db.query(`
      SELECT * FROM rentals WHERE "id" = $1 AND "returnDate" IS NULL;
      `, [idParams])

      if (alugueis.rowCount >0 ) return res.status(400).send("Esse aluguel já foi finalizado!");


    await db.query(`
                DELETE FROM
                    rentals
                WHERE 
                    id = $1;
            `, [idParams]);
            

        return res.status(200).send("Aluguel deletado!");
   }catch (error) {
    res.status(500).send(error.message);
}

}

export {getRentals, novoAluguel, apagarAluguel, finalizarAluguel}







