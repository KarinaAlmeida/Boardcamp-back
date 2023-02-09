import {db} from "../database/database.connection.js";


async function getGames (req, res) {
    try{
        const jogos= await db.query("SELECT * FROM games");
        res.send(jogos.rows);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
    
        }
}


async function postGames (req,res) {
    const {name, image, stockTotal, pricePerDay } = req.body;

try {
    // const jaExiste= await db.query(`SELECT * FROM games WHERE name = $1;`, [name])

    // if (jaExiste.rowCount >0) return res.status(409).send("Jogo já cadastrado!")

    await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, [name, image, parseInt(stockTotal), parseInt(pricePerDay)]);
   
   
    return res.status(201).send("Jogo adicionado!")
}catch (error) {
        res.status(500).send(error.message);
    }
}


export {getGames, postGames}