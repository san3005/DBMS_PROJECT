import jwt from 'jsonwebtoken';
const generatetoken=(id)=>{
return jwt.sign({id},process.env.JWT_TOKEN,
    {expiresIn:'100d'})
}
export default generatetoken;