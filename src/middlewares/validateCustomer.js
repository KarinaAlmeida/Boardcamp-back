
export default function validateCustomer (cadastraCliente) {
    
    return (req, res, next)=> {
       
        const {error}= cadastraCliente.validate (req.body, {abortEarly: false})
        if (error) return res.status(400).send(error.message)  

        next();
    }
}

