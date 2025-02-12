import jwt from 'jsonwebtoken'
import 'dotenv/config';

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env
export const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
    }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}