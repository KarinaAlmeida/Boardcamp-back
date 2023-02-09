import {db} from "../database/database.connection.js";

export default function existeGame () {
    return async (req, res, next) => {
    const {name} = req.body;
try {
    const jaExiste= await db.query(`SELECT * FROM games WHERE name = $1;`, [name])

    if (jaExiste.rowCount >0) return res.status(409).send("Jogo já cadastrado!")
 next();
}catch (error) {
    res.status(500).send(error.message);
}
    }
}