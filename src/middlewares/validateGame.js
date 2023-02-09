
export default function validateGame (cadastraGame) {
    
    return (req, res, next)=> {
       
        const {error}= cadastraGame.validate (req.body, {abortEarly: false})
        if (error) return res.status(400).send(error.message)  

        next();
    }
}

