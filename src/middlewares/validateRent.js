export default function validateRent (cadastraRent) {
    
    return (req, res, next)=> {
       
        const {error}= cadastraRent.validate (req.body, {abortEarly: false})
        if (error) return res.status(400).send(error.message)  

        next();
    }
}