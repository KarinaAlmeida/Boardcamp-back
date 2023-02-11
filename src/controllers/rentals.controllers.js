import {db} from "../database/database.connection.js";

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

}

async function finalizarAluguel (req,res) {

}

async function apagarAluguel (req,res) {

}

export {getRentals, novoAluguel, apagarAluguel, finalizarAluguel}